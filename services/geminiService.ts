
import { GoogleGenAI, Type } from "@google/genai";

export const parseExpenseWithAI = async (input: string) => {
  if (!process.env.API_KEY) {
    console.warn("API Key do Gemini não configurada.");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse a seguinte descrição de despesa em um objeto JSON com campos 'description', 'amount' (número), 'category' e 'icon' (um nome de ícone do Lucide como 'Coffee', 'ShoppingBag', 'Car', etc). Entrada: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            icon: { type: Type.STRING }
          },
          required: ["description", "amount", "category", "icon"]
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text.trim()) : null;
  } catch (error) {
    console.error("Erro ao processar com Gemini:", error);
    return null;
  }
};
