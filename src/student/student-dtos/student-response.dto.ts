import { School } from "src/school/school.entity";
import { Standard } from "../student-enums/class.enum";
import { IsEnum } from "class-validator";

export class StudentResponseDto{
    name:string;
    rollNo:string;
    age:number;
    @IsEnum(Standard)
    standard:Standard;
    school:string;
}