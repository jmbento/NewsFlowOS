
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface MeetingAnalysis {
  nodes: {
    type: 'os' | 'task';
    label: string;
    assignee: string;
    deadline?: string;
    checklist?: string[];
  }[];
}

export const analyzeMeetingTranscription = async (transcription: string): Promise<MeetingAnalysis | null> => {
  const prompt = `
    Você é um gestor de jornalismo. Analise esta transcrição e retorne um JSON estruturado para criação de nós de fluxo de trabalho editorial.
    
    O NewsFlow OS utiliza tipos de nós 'os' (Ordem de Serviço com checklist) e 'task' (Tarefa Simples).
    
    RETORNE APENAS UM JSON VÁLIDO no seguinte formato:
    {
      "nodes": [
        {
          "type": "os" | "task",
          "label": "Título",
          "assignee": "Nome do Responsável",
          "deadline": "YYYY-MM-DD",
          "checklist": ["item1", "item2"]
        }
      ]
    }

    Transcrição: "${transcription}"
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Extrair JSON do texto (caso venha com markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
};
