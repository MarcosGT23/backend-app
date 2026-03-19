import { GoogleGenAI } from "@google/genai";
import { ChatDto } from "../dtos/chat.dto";

export const chatUseCase = async (
    ai: GoogleGenAI,
    chatDto: ChatDto
) => {
    const { message, history, profile } = chatDto;

    const systemPrompt = `
        Eres FitBot, el asistente inteligente de la app FitTrack.
        Tu objetivo es ayudar al usuario con su nutrición, ejercicios y bienestar.
        Responde de forma amigable, motivadora y basada en datos científicos.
        Perfil del usuario: ${JSON.stringify(profile ?? 'No disponible')}
        Responde únicamente en formato JSON con la siguiente estructura:
        {
            "reply": "Tu respuesta aquí en texto plano o markdown amigable"
        }
    `;

    const result = await ai.models.generateContent({
            model: "gemini-1.5-flash",
        contents: [
            {
                role: "user",
                parts: [{ text: systemPrompt + "\n\nHistorial:\n" + JSON.stringify(history) + "\n\nNuevo mensaje: " + message }]
            }
        ]
    });

    const text = result.text ?? '';
    const jsonString = text.replace(/```json|```/g, '').trim();
    
    try {
        const parsed = JSON.parse(jsonString);
        return typeof parsed === 'string' ? { reply: parsed } : (parsed.reply ? parsed : { reply: text });
    } catch (e) {
        return {
            reply: text
        };
    }
}
