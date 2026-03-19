import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt.dto';
import { FoodAnalysisDto } from './dtos/food-analysis.dto';
import { GoogleGenAI } from "@google/genai";
import { basicPromptUseCase } from './use-cases/basic-prompt.use-case';
import { analyzeFoodUseCase } from './use-cases/analyze-food.use-case';

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
}
