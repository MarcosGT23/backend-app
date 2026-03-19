import { GoogleGenAI } from "@google/genai";
import { FoodAnalysisDto } from "../dtos/food-analysis.dto";

export const analyzeFoodUseCase = async (
    ai: GoogleGenAI,
    foodAnalysisDto: FoodAnalysisDto
) => {
    const { image_base64, mime_type } = foodAnalysisDto;

    const prompt = `
        Analiza esta imagen de comida y proporciona la siguiente información en formato JSON puro (sin bloques de código markdown):
        {
            "food_name": "Nombre del plato",
            "description": "Breve descripción incluyendo sugerencias saludables",
            "calories": 0,
            "protein_g": 0.0,
            "carbs_g": 0.0,
            "fat_g": 0.0,
            "fiber_g": 0.0,
            "ingredients": ["ingrediente 1", "ingrediente 2"],
            "portion_size": "Tamaño estimado de la porción",
            "confidence_note": "Nota sobre la confianza del análisis"
        }
    `;

    const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                role: "user",
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: mime_type,
                            data: image_base64
                        }
                    }
                ]
            }
        ]
    });

    const text = result.text ?? '';
    const jsonString = text.replace(/```json|```/g, '').trim();
    
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return {
            error: "Failed to parse AI response as JSON",
            raw: text
        };
    }
}
