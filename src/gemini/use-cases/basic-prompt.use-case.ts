import { GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt.dto";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptUseCase = async (
    ai: GoogleGenAI,
    basicPromptDto: BasicPromptDto,
    options?: Options
) => {

    const {
        model = 'gemini-embedding-001',
        systemInstruction = 'Responde únicamente en español en formato markdown.',
    } = options?? {};

    const response = await ai.models.generateContent({
            model: model,
            contents: basicPromptDto.prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text;
    
}