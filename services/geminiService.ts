
import { GoogleGenAI, Type } from "@google/genai";
import { Chef, CuisineType, MenuRecommendation, Dish } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIConciergeSuggestion = async (prompt: string, chefNames: string[]): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `From the following list of chefs, which ones are the best match for this request: "${prompt}". List of chefs: ${chefNames.join(', ')}. Return only a JSON array of the best matching chef names, like ["Chef Name 1", "Chef Name 2"].`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        console.error("Error with AI Concierge:", error);
        return [];
    }
};

export const getSimilarMenus = async (cuisine: string, pricePoint: number, excludedChefName: string): Promise<MenuRecommendation[]> => {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Suggest 3 alternative menus from different private chefs (NOT named ${excludedChefName}) that are similar to the cuisine style: "${cuisine}" and around the price point of £${pricePoint}.
    
    For each suggestion, provide:
    - chefName: A new realistic chef name.
    - menuName: A creative name for the menu.
    - pricePerHead: A price close to £${pricePoint}.
    - description: A one-sentence description of the menu vibe.
    - matchReason: A short string explaining why it's a good alternative (e.g., "Similar Italian Style", "Great Value Option", "Luxury Upgrade").
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              chefName: { type: Type.STRING },
              menuName: { type: Type.STRING },
              pricePerHead: { type: Type.NUMBER },
              description: { type: Type.STRING },
              matchReason: { type: Type.STRING }
            }
          }
        }
      }
    });

    const recs = JSON.parse(response.text || "[]");
    
    return recs.map((rec: any, index: number) => ({
      ...rec,
      chefId: `sim-chef-${index}`,
      chefImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(rec.chefName)}&background=random&size=128`
    }));

  } catch (error) {
    console.error("Error fetching similar menus:", error);
    return [];
  }
}

export const generateBookingConfirmation = async (chefName: string, menuName: string, guests: number, date: string, time: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Write a sophisticated, warm, and professional booking confirmation message for a client who just booked Chef ${chefName} for the "${menuName}" menu on ${date} at ${time} for ${guests} guests. Keep it under 50 words.`
        });
        return response.text || "Booking confirmed! Your chef will be in touch shortly.";
    } catch (e) {
        return "Booking confirmed! Your chef will be in touch shortly.";
    }
}
