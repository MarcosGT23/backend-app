import { IsArray, IsNumber, IsObject, IsOptional } from "class-validator";

export class SuggestionsDto {
    @IsObject()
    profile: any;

    @IsNumber()
    today_calories: number;

    @IsObject()
    today_macros: {
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
    };

    @IsArray()
    weight_trend: number[];
}
