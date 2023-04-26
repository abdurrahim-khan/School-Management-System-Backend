import { Board } from "../school-enums/board.enum";
import { IsEnum, IsNotEmpty } from "class-validator";
export class SchoolRequestDto{
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    address:string;
    @IsEnum(Board)
    @IsNotEmpty()
    board: Board;//
}