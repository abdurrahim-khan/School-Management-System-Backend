import { Role } from "src/enums/role.enum";
import { Standard } from "../student-enums/class.enum";
import { SchoolRequestDto } from "src/school/school-dto/school-request.dto";
import { IsEnum, IsNotEmpty, IsNotEmptyObject, IsObject } from "class-validator";

export class CreateStudentRequestDto{
   
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    rollNo:string;
    @IsNotEmpty()
    age:number;
    @IsEnum(Standard)
    @IsNotEmpty()
    standard:Standard;
    @IsObject()
    @IsNotEmptyObject()
    school:SchoolRequestDto;
    @IsNotEmpty()
    userId:string;
}