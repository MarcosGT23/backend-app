import { GoogleGenAI } from "@google/genai";
import { ChatDto } from "../dtos/chat.dto";

export const chatUseCase = async (
    ai: GoogleGenAI,
    chatDto: ChatDto
) => {
    const { message, history, profile } = chatDto;

    console.log('[ChatUseCase] Incoming message:', message);
    console.log('[ChatUseCase] History length:', history?.length);

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

    try {
        const result = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt + "\n\nHistorial:\n" + JSON.stringify(history) + "\n\nNuevo mensaje: " + message }]
                }
            ]
        });

        console.log('[ChatUseCase] AI Result received');
        
        // Try all ways to get text from the official SDKs
        const text = result.text || (result as any).response?.text?.() || (result as any).response?.text || '';
        
        if (!text) {
            console.error('[ChatUseCase] Empty text received from AI result:', JSON.stringify(result));
        }

        const jsonString = text.replace(/```json|```/g, '').trim();
        
        try {
            const parsed = JSON.parse(jsonString);
            return typeof parsed === 'string' ? { reply: parsed } : (parsed.reply ? parsed : { reply: text });
        } catch (e) {
            console.warn('[ChatUseCase] JSON parse failed, returning raw text. Text:', text);
            return {
                reply: text
            };
        }
    } catch (error) {
        console.error('[ChatUseCase] Error calling Gemini API:', error);
        throw error;
    }
}
