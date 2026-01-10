
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractTasksFromTranscript = async (transcript: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Extract editorial tasks from the following meeting transcript. 
    Return a JSON array of tasks where each task has: title, responsible, status (todo), and a brief description.
    Transcript: "${transcript}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            responsible: { type: Type.STRING },
            status: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "responsible", "status"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};

export const generateCreativeImage = async (prompt: string, aspectRatio: string = "16:9") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `Editorial illustration for: ${prompt}. High quality, cinematic style.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const chatWithGemini = async (message: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: message,
    config: {
      systemInstruction: "You are NewsFlow Assistant, an expert in editorial workflows and journalism."
    }
  });
  return response.text;
};
