import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './user-dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './interfaces/payload.interface';
import { SigninResponse } from './interfaces/signin-response.interface';
import { CreateSchoolRequestDto } from 'src/school/school-dto/create-school-request.dto';
import { StudentService } from 'src/student/student.service';
import { SchoolService } from 'src/school/school.service';
import { CreateStudentRequestDto } from 'src/student/student-dtos/create-student-request.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository:Repository<UserEntity>,
        private jwtService:JwtService,
        
        private schoolService:SchoolService,
        private studentService: StudentService
    ){}
    async createUser(userDto:UserDto):Promise<UserEntity>{
        console.log(userDto.studentSchool);
        const {username, password, role} = userDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = this.userRepository.create({
            username,
            password:hashedPassword,
            role
        })
        
        try{
           var result:UserEntity =  await this.userRepository.save(user);
        }
        catch(error){
            console.log(error.code);
            if(error.code === '23505'){
                throw new ConflictException('username already exists')
            }
            else{
                throw new InternalServerErrorException();
            }
            
        }
        const {schoolName,schoolAddress,schoolBoard,studentAge,studentName,studentRollNo,studentSchool,studentStandard} = userDto;
        if(role === "SCHOOL"){
            const createSchoolRequestDto: CreateSchoolRequestDto= {
                name:schoolName,
                address:schoolAddress,
                board:schoolBoard,
                userId:result.id
            }
            this.schoolService.createSchool(createSchoolRequestDto);

        }
        else if(role==="STUDENT"){
            const createStudentRequestDto : CreateStudentRequestDto={
                name:studentName,
                age:studentAge,
                rollNo:studentRollNo,
                standard:studentStandard,
                school:studentSchool,
                userId:result.id
            }
            console.log("first")
            this.studentService.createStudent(createStudentRequestDto);
            console.log("second")
        }
        return result;
    }
    async getUser(userDto:UserDto):Promise<SigninResponse>{
        const {username, password, role} = userDto;
        const user = await this.userRepository.findOneBy({username});
        const correctPassword = await bcrypt.compare(password,user.password);
        console.log(user);
        console.log(correctPassword);
        if(user && correctPassword && (role===user.role)){
            const payload:Payload = {username,role};
            const accessToken = await this.jwtService.signAsync(payload);
            const message:string = "signin successful";
            const signinResponse:SigninResponse = {accessToken,message};
            return signinResponse;
        }
        else{
            throw new UnauthorizedException('bad credentials');
        }
    }
}
