import { Injectable } from '@nestjs/common';
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
    private ai = new GoogleGenAI({
        apiKey: process.env.GOOGLE_API_KEY,
    });

    async basicPrompt(basicPromptDto: BasicPromptDto){
        return basicPromptUseCase(this.ai, basicPromptDto);
    }

    async analyzeFood(foodAnalysisDto: FoodAnalysisDto){
        return analyzeFoodUseCase(this.ai, foodAnalysisDto);
    }

    async getSuggestions(suggestionsDto: SuggestionsDto){
        return suggestionsUseCase(this.ai, suggestionsDto);
    }

    async chat(chatDto: ChatDto){
        return chatUseCase(this.ai, chatDto);
    }
}
