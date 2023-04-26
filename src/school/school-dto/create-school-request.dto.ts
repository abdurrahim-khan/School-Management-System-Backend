import { Role } from "src/enums/role.enum";
import { Board } from "../school-enums/board.enum";
import { IsEnum, IsNotEmpty } from "class-validator";
export class CreateSchoolRequestDto{
    
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    address:string;
    @IsEnum(Board)
    @IsNotEmpty()
    board:Board;
    @IsNotEmpty()
    userId:string;
}