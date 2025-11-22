import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IDVS_RUBRIC_TEXT } from "../constants";
import { IdvsReport, EvaluationCategory } from "../types";

const apiKey = process.env.API_KEY;

// Define the JSON Schema for the Gemini response strictly
const metricSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "e.g., GEO-1" },
    name: { type: Type.STRING, description: "Metric Name" },
    score: { type: Type.NUMBER, description: "Score awarded" },
    maxScore: { type: Type.NUMBER, description: "Maximum possible score" },
    observation: { type: Type.STRING, description: "Why this score was given based on the text" },
    recommendation: { type: Type.STRING, description: "How to improve this specific metric" },
  },
  required: ["id", "name", "score", "maxScore", "observation", "recommendation"],
};

const categoryResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    maxScore: { type: Type.NUMBER },
    summary: { type: Type.STRING },
    metrics: {
      type: Type.ARRAY,
      items: metricSchema,
    },
  },
  required: ["score", "maxScore", "summary", "metrics"],
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    targetUrlOrTitle: { type: Type.STRING },
    overallScore: { type: Type.NUMBER },
    grade: { type: Type.STRING },
    criticalIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
    breakdown: {
      type: Type.OBJECT,
      properties: {
        [EvaluationCategory.GEO]: categoryResultSchema,
        [EvaluationCategory.AIO]: categoryResultSchema,
        [EvaluationCategory.SEO]: categoryResultSchema,
      },
      required: [EvaluationCategory.GEO, EvaluationCategory.AIO, EvaluationCategory.SEO],
    },
    jsonLdSuggestion: { type: Type.OBJECT, description: "A suggested JSON-LD structure for the content" },
  },
  required: ["targetUrlOrTitle", "overallScore", "grade", "breakdown", "criticalIssues", "jsonLdSuggestion"],
};

export const analyzeContent = async (content: string, title?: string): Promise<IdvsReport> => {
  if (!apiKey) {
    throw new Error("API Key is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an IDVS (Integrated Digital Visibility Standard) Auditor.
    Your task is to evaluate the provided web content text against the IDVS 2025 Rubric.
    
    The Rubric Definition:
    ${IDVS_RUBRIC_TEXT}
    
    Instructions:
    1. Analyze the text rigorously. Be critical. High scores require explicit evidence.
    2. Calculate scores for GEO, AIO, and SEO based on the metrics defined.
    3. Provide actionable feedback.
    4. Generate a valid JSON-LD structure (Article + FAQPage or ClaimReview) that would improve this content.
    
    Input Title Context: ${title || "Untitled Content"}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: content }],
        },
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for consistent, analytical results
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from Gemini");
    }
    return JSON.parse(text) as IdvsReport;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
