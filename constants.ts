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

COMPREHENSIVE METABOLIC PANEL
-----------------------------
GLUCOSE           108 mg/dL    (High)   Ref: 65-99
BUN               14 mg/dL     (Normal) Ref: 7-25
CREATININE        0.9 mg/dL    (Normal) Ref: 0.60-1.35
SODIUM            140 mmol/L   (Normal) Ref: 135-146
POTASSIUM         4.2 mmol/L   (Normal) Ref: 3.5-5.3
CHLORIDE          102 mmol/L   (Normal) Ref: 98-107
CO2               26 mmol/L    (Normal) Ref: 21-31
CALCIUM           9.4 mg/dL    (Normal) Ref: 8.6-10.3
PROTEIN, TOTAL    7.1 g/dL     (Normal) Ref: 6.1-8.1
ALBUMIN           4.6 g/dL     (Normal) Ref: 3.6-5.1
GLOBULIN          2.5 g/dL     (Normal) Ref: 1.9-3.7
A/G RATIO         1.8                   Ref: 1.0-2.5
BILIRUBIN, TOTAL  0.6 mg/dL    (Normal) Ref: 0.2-1.2
ALK PHOSPHATASE   65 IU/L      (Normal) Ref: 40-115
AST (SGOT)        22 IU/L      (Normal) Ref: 10-40
ALT (SGPT)        58 IU/L      (High)   Ref: 9-46

LIPID PANEL
-----------
CHOLESTEROL, TOTAL  210 mg/dL  (High)   Ref: <200
TRIGLYCERIDES       160 mg/dL  (High)   Ref: <150
HDL CHOLESTEROL     42 mg/dL   (Low)    Ref: >40
LDL CHOLESTEROL     138 mg/dL  (High)   Ref: <100

NOTES: Patient reports fatigue and mild weight gain. Advised lifestyle changes.`;