
import { AnalysisType } from './types';

export const APP_NAME = "ClearHealth AI";

export const SAMPLE_PROMPTS = {
  [AnalysisType.LAB_REPORT]: "Upload blood test results, radiology reports, clinical notes, or insurance documents (PDF, DOCX, JPG, PNG).",
  [AnalysisType.SYMPTOM_CHECK]: "Upload a clear photo of the skin condition, physical injury, or visible symptom.",
};

export const MODEL_CONFIG = {
  textModel: "gemini-3-pro-preview",
  visionModel: "gemini-3-pro-preview", 
};

export const DISCLAIMER_TEXT = "ClearHealth AI is an informational tool and does not provide medical diagnosis. Always consult a qualified healthcare professional.";

export const SAMPLE_REPORT_TEXT = `PATIENT: JOHN DOE
DOB: 05/12/1980
DATE: OCT 24, 2024

COMPREHENSIVE METABOLIC PANEL & TRENDS
--------------------------------------
GLUCOSE           108 mg/dL    (High)   Ref: 65-99
Historical: 
- 05/12/2024: 102 mg/dL
- 11/15/2023: 98 mg/dL
- 04/10/2023: 95 mg/dL

BUN               14 mg/dL     (Normal) Ref: 7-25
CREATININE        0.9 mg/dL    (Normal) Ref: 0.60-1.35
SODIUM            140 mmol/L   (Normal) Ref: 135-146
POTASSIUM         4.2 mmol/L   (Normal) Ref: 3.5-5.3

LIPID PANEL & TRENDS
--------------------
CHOLESTEROL, TOTAL  210 mg/dL  (High)   Ref: <200
Historical:
- 05/12/2024: 205 mg/dL
- 11/15/2023: 190 mg/dL
- 04/10/2023: 185 mg/dL

LDL CHOLESTEROL     138 mg/dL  (High)   Ref: <100
Historical:
- 05/12/2024: 130 mg/dL
- 11/15/2023: 110 mg/dL

ALT (SGPT)        58 IU/L      (High)   Ref: 9-46
Historical:
- 05/12/2024: 45 IU/L (Normal)

NOTES: Patient reports fatigue and mild weight gain. Advised lifestyle changes.`;
