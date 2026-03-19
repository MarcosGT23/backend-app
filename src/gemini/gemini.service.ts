import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { FoodAnalysisDto } from './dtos/food-analysis.dto';
import { SuggestionsDto } from './dtos/suggestions.dto';
import { ChatDto } from './dtos/chat.dto';
import { basicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { analyzeFoodUseCase } from './use-cases/analyze-food.use-case';
import { suggestionsUseCase } from './use-cases/suggestions.use-case';
import { chatUseCase } from './use-cases/chat.use-case';

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private ai: GoogleGenAI;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
        if (!apiKey) {
            this.logger.error('GOOGLE_API_KEY is not defined in the environment variables');
        }
        this.ai = new GoogleGenAI({
            apiKey: apiKey,
        });
    }

    async basicPrompt(basicPromptDto: BasicPromptDto){
        try {
            return await basicPromptUseCase(this.ai, basicPromptDto);
        } catch (error) {
            this.logger.error(`Error in basicPrompt: ${error.message}`, error.stack);
            throw error;
        }
    }

    async analyzeFood(foodAnalysisDto: FoodAnalysisDto){
        try {
            return await analyzeFoodUseCase(this.ai, foodAnalysisDto);
        } catch (error) {
            this.logger.error(`Error in analyzeFood: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getSuggestions(suggestionsDto: SuggestionsDto){
        try {
            return await suggestionsUseCase(this.ai, suggestionsDto);
        } catch (error) {
            this.logger.error(`Error in getSuggestions: ${error.message}`, error.stack);
            throw error;
        }
    }

    async chat(chatDto: ChatDto){
        try {
            this.logger.log(`Starting chat with message: ${chatDto.message.substring(0, 50)}...`);
            const result = await chatUseCase(this.ai, chatDto);
            return result;
        } catch (error) {
            this.logger.error(`Error in chat: ${error.message}`, error.stack);
            throw error;
        }
    }
}
