import { GoogleGenAI } from "@google/genai";
import { SuggestionsDto } from "../dtos/suggestions.dto";

export const suggestionsUseCase = async (
    ai: GoogleGenAI,
    suggestionsDto: SuggestionsDto
) => {
    const { profile, today_calories, today_macros, weight_trend } = suggestionsDto;

    const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `
                        Actúa como un experto en nutrición y fitness. Analiza los siguientes datos del usuario y genera sugerencias personalizadas:
                        
                        Perfil: ${JSON.stringify(profile)}
                        Kilocalorías consumidas hoy: ${today_calories}
                        Macros consumidos hoy: ${JSON.stringify(today_macros)}
                        Tendencia de peso (últimos 7 registros): ${JSON.stringify(weight_trend)}
                        
                        Responde en formato JSON puro con la siguiente estructura (sin códigos markdown):
                        {
                            "suggestions": [
                                {
                                    "id": "1",
                                    "title": "Título corto",
                                    "description": "Descripción de la sugerencia",
                                    "type": "calories|protein|activity|health",
                                    "priority": "low|medium|high",
                                    "action_label": "Texto del botón de acción (opcional)",
                                    "emoji": "💡"
                                }
                            ],
                            "weekly_plan": [
                                { "day": "Lunes", "activity": "Descripción", "is_rest": false }
                            ],
                            "insight_text": "Análisis motivador corto",
                            "insight_emoji": "💪"
                        }
                        `
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
