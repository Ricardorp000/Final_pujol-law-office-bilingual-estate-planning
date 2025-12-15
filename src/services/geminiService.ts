import { GoogleGenAI, Type } from "@google/genai";
import { BilingualExplanation } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateLegalExplanation = async (term: string): Promise<BilingualExplanation> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const prompt = `
    Explain the legal concept "${term}" for a client who has no legal background. 
    1. Explain it in very simple, reassuring English. 
    2. Explain it in very simple, reassuring Spanish.
    
    For each language, provide:
    - A clear, friendly Title.
    - A Simple Definition (2-3 sentences max).
    - An "Analogy" that makes it easy to visualize (e.g., "Think of it like a bucket...").
    - 3 Key Benefits (short bullet points).

    Ensure the tone is warm, professional, and easy to understand.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: "You are an empathetic, world-class estate planning attorney explaining concepts to a new client. You prioritize clarity over jargon.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          english: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              definition: { type: Type.STRING },
              analogy: { type: Type.STRING },
              keyBenefits: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "definition", "analogy", "keyBenefits"]
          },
          spanish: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              definition: { type: Type.STRING },
              analogy: { type: Type.STRING },
              keyBenefits: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "definition", "analogy", "keyBenefits"]
          }
        },
        required: ["english", "spanish"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response generated");
  }

  return JSON.parse(response.text) as BilingualExplanation;
};