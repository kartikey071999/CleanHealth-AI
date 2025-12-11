import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { AnalysisResult, AnalysisType } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A short, descriptive title of the analysis" },
    summary: { type: Type.STRING, description: "A simple, easy-to-understand summary of the findings in 2-3 sentences." },
    severity: { type: Type.STRING, enum: ['low', 'medium', 'high', 'unknown'], description: "Estimated severity level based on findings." },
    findings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the biomarker, symptom, or observation." },
          value: { type: Type.STRING, description: "The specific value identified (e.g., '140 mg/dL') if applicable." },
          status: { type: Type.STRING, enum: ['normal', 'abnormal', 'critical', 'informational'], description: "Status of this finding." },
          explanation: { type: Type.STRING, description: "Simple explanation of what this means for the patient." },
        },
        required: ['name', 'status', 'explanation']
      }
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of actionable next steps or questions to ask a doctor."
    },
    medicalDisclaimer: { type: Type.STRING, description: "A mandatory medical disclaimer specific to this analysis." }
  },
  required: ['title', 'summary', 'severity', 'findings', 'recommendations', 'medicalDisclaimer']
};

export interface FileData {
  data: string; // base64 string
  mimeType: string;
}

export const analyzeDocument = async (
  file: FileData,
  type: AnalysisType
): Promise<AnalysisResult> => {
  if (!apiKey) throw new Error("API Key not found");

  const prompt = type === AnalysisType.LAB_REPORT
    ? "Analyze this medical document. It could be a lab report, doctor's note, or clinical summary. Extract key biomarkers, identify abnormalities, and explain them in simple layman's terms. Cross-reference values to provide a synthesized insight."
    : "Analyze this image of a physical symptom. Describe the visual characteristics, suggest potential causes (informational only), and recommend whether immediate medical attention might be needed. Be empathetic but objective.";

  try {
    const parts: any[] = [{ text: prompt }];

    // Handle different file types
    if (file.mimeType.startsWith('text/') || file.mimeType === 'application/json' || file.mimeType === 'application/csv') {
      try {
        const textContent = atob(file.data);
        parts.push({ text: `\n\n--- DOCUMENT CONTENT ---\n${textContent}\n--- END DOCUMENT CONTENT ---\n` });
      } catch (e) {
        console.warn("Text decoding failed, trying inlineData fallback");
        parts.push({ inlineData: { mimeType: 'text/plain', data: file.data } });
      }
    } else {
      parts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 2048 },
        systemInstruction: "You are an advanced medical AI assistant. Your goal is to demystify medical data. You are NOT a doctor. You must be accurate, conservative in your assessment, and always prioritize patient safety by recommending professional consultation. Use simple language."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateAudioSummary = async (text: string): Promise<ArrayBuffer> => {
  if (!apiKey) throw new Error("API Key not found");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Here is your Clear Health summary. ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore has a calm, professional tone
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");

  // Decode Base64 to ArrayBuffer
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const sendChatMessage = async (
  history: { role: 'user' | 'model', text: string }[],
  currentMessage: string,
  context?: AnalysisResult
): Promise<string> => {
    if (!apiKey) throw new Error("API Key not found");

    const systemContext = context 
      ? `Current Analysis Context: ${JSON.stringify(context)}. User is asking follow-up questions about this analysis.`
      : "User is asking general medical health questions.";

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are a helpful medical assistant. ${systemContext} Keep answers concise and helpful. Always remind the user to see a doctor for diagnosis.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: currentMessage });
    return result.text || "I'm sorry, I couldn't process that.";
};

export interface SpecialistRecommendation {
  text: string;
  chunks: any[];
}

export const findNearbySpecialists = async (
  medicalContext: string,
  lat: number,
  lng: number
): Promise<SpecialistRecommendation> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on this medical context: "${medicalContext}", identify the most appropriate type of medical specialist (e.g., Cardiologist, Dermatologist, General Practitioner) and find 3 top-rated ones near the user's location. Return a list with their names and ratings.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    return {
      text: response.text || "No specialists found nearby.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error finding specialists:", error);
    throw new Error("Failed to find specialists");
  }
};