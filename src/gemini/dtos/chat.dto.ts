import { IsArray, IsObject, IsOptional, IsString } from "class-validator";

export class ChatDto {
    @IsString()
    message: string;

    @IsArray()
    history: { role: string; content: string }[];

    @IsOptional()
    @IsObject()
    profile?: any;
}
