import { Body, Controller, Delete, Get, Param, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm'
import { Filter, Repository } from 'typeorm';
import { School } from './school.entity';
import { SchoolService } from './school.service';
import { SchoolRequestDto } from './school-dto/school-request.dto';
import { SchoolResponseDto } from './school-dto/school-response.dto';
import { CreateSchoolRequestDto } from './school-dto/create-school-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/custom-decoarators/get-user.decorator';
import { UserEntity } from 'src/auth/user.entity';
import { Student } from 'src/student/student.entity';
import { FilterDto } from './school-dto/filter.dto';
import { Role } from 'src/enums/role.enum';
@Controller('school')
@UseGuards(AuthGuard())
export class SchoolController {
    constructor(private schoolService:SchoolService){}
    /*@Post('/signup')
    async createSchool(@Body() createSchoolRequestDto:CreateSchoolRequestDto):Promise<SchoolResponseDto>{
        return this.schoolService.createSchool(createSchoolRequestDto);
    }*/
    /*@Get('/get/id/:id')
    async getSchoolById(@Param('id') id:string):Promise<SchoolResponseDto>{
        return this.schoolService.getSchoolById(id);
    }*/
    @Get('/getMySchool')
    async getMySchool(@GetUser() user: UserEntity):Promise<SchoolResponseDto>{
        if(user.role !== Role.SCHOOL){
            throw new UnauthorizedException('you are not authorised')
        }
        return this.schoolService.getMySchool(user);
    }
    @Get('/getStudents')
    async getStudents(@Query() filterDto:FilterDto, @GetUser() user:UserEntity):Promise<Student[]>{
        if(user.role !== Role.SCHOOL){
            throw new UnauthorizedException('you are not authorised')
        }
        return this.schoolService.getStudents(user,filterDto);
    }
    @Get('/getAllStudents')
    async getAllStudents(@GetUser() user:UserEntity):Promise<Student[]>{
        if(user.role !== Role.SCHOOL){
            throw new UnauthorizedException('you are not authorised')
        }
        return this.schoolService.getAllStudents(user);
    }
    @Put('/update')
    async updateSchool(@GetUser() user:UserEntity,@Body() schoolRequestDto:SchoolRequestDto):Promise<SchoolResponseDto>{
        if(user.role !== Role.SCHOOL){
            throw new UnauthorizedException('you are not authorised')
        }
        return this.schoolService.updateSchool(user,schoolRequestDto);
    }
    /*@Delete('/delete')
    async delete():Promise<string>{
        return this.schoolService.deleteAll();
    }*/
    @Delete('/delete')
    async delete(@GetUser() user:UserEntity):Promise<SchoolResponseDto>{
        if(user.role !== Role.SCHOOL){
            throw new UnauthorizedException('you are not authorised')
        }
        return this.schoolService.delete(user);
    }

}
