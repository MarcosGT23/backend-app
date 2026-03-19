import { IsNotEmpty, IsString } from "class-validator";

export class FoodAnalysisDto {
    @IsString()
    @IsNotEmpty()
    image_base64: string;

    @IsString()
    @IsNotEmpty()
    mime_type: string;
}
