import { IsEnum, IsObject, IsOptional, IsString, IsStrongPassword, Matches, MaxLength, MinLength } from "class-validator";
import { Role } from "src/enums/role.enum";
import { SchoolRequestDto } from "src/school/school-dto/school-request.dto";
import { Board } from "src/school/school-enums/board.enum";
import { Standard } from "src/student/student-enums/class.enum";

export class UserDto{
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username:string;
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    //either can be used
    @IsStrongPassword({minLength:8,minLowercase:1,minNumbers:1,minSymbols:1,minUppercase:1},{message:'weak password'})
    //@Matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])$/,{message:'weak password'})
    password:string;
    @IsEnum(Role)
    role:Role;

    //school creation
    @IsOptional()
    schoolName?:string;
    @IsOptional()
    schoolAddress?:string;
    @IsOptional()
    @IsEnum(Board)
    schoolBoard?:Board;

    //student creation
    @IsOptional()
    studentName?:string;
    @IsOptional()
    studentAge?:number;
    @IsOptional()
    studentRollNo?:string;
    @IsOptional()
    @IsEnum(Standard)
    studentStandard?:Standard;
    @IsOptional()
    @IsObject()
    studentSchool?:SchoolRequestDto;
}