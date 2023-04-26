import { School } from "src/school/school.entity";
import { Standard } from "../student-enums/class.enum";
import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsObject } from "class-validator";

export class StudentRequestDto{
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    age:number;
    @IsNotEmpty()
    rollNo:string;
    @IsEnum(Standard)
    @IsNotEmpty()
    standard:Standard;
    @IsObject()
    @IsNotEmptyObject()
    school:School;
}