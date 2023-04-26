import { IsEnum, IsOptional } from "class-validator";
import { Standard } from "src/student/student-enums/class.enum";

export class FilterDto{
    @IsOptional()
    @IsEnum(Standard)
    standard?:Standard;
    @IsOptional()
    search?:string;
}