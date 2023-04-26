import { IsEnum } from "class-validator";
import { Board } from "../school-enums/board.enum";

export class SchoolResponseDto{
    name:string;
    address:string;
    @IsEnum(Board)
    board:Board;
}