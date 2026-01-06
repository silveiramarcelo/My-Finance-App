
import { GoogleGenAI, Type } from "@google/genai";

export const parseExpenseWithAI = async (input: string) => {
  // Always use a new GoogleGenAI instance with the direct process.env.API_KEY as per guidelines
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

    // Access .text property directly (not as a method)
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Erro ao processar com Gemini:", error);
    return null;
  }
};
