import { Body, Controller, Delete, Get, Param, Post, Put, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { CreateStudentRequestDto } from './student-dtos/create-student-request.dto';
import { StudentResponseDto } from './student-dtos/student-response.dto';
import { StudentRequestDto } from './student-dtos/student-request.dto';
import { identity } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/auth/user.entity';
import { GetUser } from 'src/custom-decoarators/get-user.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('student')
@UseGuards(AuthGuard())
export class StudentController {
    constructor(
        private studentService: StudentService
    ){}
    /*@Post('/signup')
    async createStudent(@Body() createStudentRequestDto:CreateStudentRequestDto):Promise<StudentResponseDto>{
        return await this.studentService.createStudent(createStudentRequestDto);
    }
    @Get('/get/id/:id')
    async getStudentById(@Param('id') id:string):Promise<StudentResponseDto>{
        return await this.studentService.getStudentByIdOuter(id);
    }*/
    @Get('/getMyDetails')
    async getMyDetails(@GetUser() user: UserEntity):Promise<Student>{
        if(user.role !== Role.STUDENT){
            throw new UnauthorizedException('you are not authorised')
        }
       return this.studentService.getMyDetails(user);
    }
    @Put('/update')
    async updateStudent(@Body() studentRequestDto:StudentRequestDto,@GetUser() user:UserEntity):Promise<StudentResponseDto>
    {
        if(user.role !== Role.STUDENT){
            throw new UnauthorizedException('you are not authorised')
        }
        return await this.studentService.updateStudent(user,studentRequestDto);
    }
    /*@Delete('/delete')
    async deleteAll():Promise<string>{
        return await this.studentService.deleteAll();
    }*/
    @Delete('/delete')
    async delete(@GetUser() user:UserEntity):Promise<StudentResponseDto>{
        if(user.role !== Role.STUDENT){
            throw new UnauthorizedException('you are not authorised')
        }
        return await this.studentService.delete(user);
    }
}
