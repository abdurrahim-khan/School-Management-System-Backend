import { Injectable, NotFoundException, forwardRef , Inject, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from './school.entity';
import { Like, Repository } from 'typeorm';
import { SchoolRequestDto } from './school-dto/school-request.dto';
import { SchoolResponseDto } from './school-dto/school-response.dto';
import { CreateSchoolRequestDto } from './school-dto/create-school-request.dto';
import { Student } from 'src/student/student.entity';
import { StudentService } from 'src/student/student.service';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from 'src/auth/user-dto/user.dto';
import { UserEntity } from 'src/auth/user.entity';
import { Standard } from 'src/student/student-enums/class.enum';
import { FilterDto } from './school-dto/filter.dto';
import { filter } from 'rxjs';

@Injectable()
export class SchoolService {
    constructor(@InjectRepository(School) public schoolRepository: Repository<School>,
    private studentService: StudentService
    ){}
    async createSchool(createSchoolRequestDto:CreateSchoolRequestDto):Promise<SchoolResponseDto>{
        const { name, address, board, userId} = createSchoolRequestDto;
        const studentsArray: Student[] = [];
        const school =  this.schoolRepository.create({
            name,
            address,
            board,
            students: studentsArray,
            userId
        })
        await this.schoolRepository.save(school);
        const response:SchoolResponseDto={
            name,
            address,
            board
        }
        return response;
    }
    /*async getSchoolById(id:string):Promise<SchoolResponseDto>{
        const school = await this.schoolRepository.findOneBy({id});
        if(!school)
        {
            throw new NotFoundException('school doesnt exist');
        }
        const {name,address,board} = school;
        const response:SchoolResponseDto={
            name,
            address,
            board
        }
        return response;
    }*/
    async getMySchool(user:UserEntity):Promise<SchoolResponseDto>{
        const id = user.id;
        const school = await this.schoolRepository.findOneBy({userId:id});
        if(!school)
        {
            throw new NotFoundException('school doesnt exist');
        }
        const {name,address,board} = school;
        const response:SchoolResponseDto={
            name,
            address,
            board
        }
        return response;
    }
    async getAllStudents(user:UserEntity):Promise<Student[]>{
        const school = await this.schoolRepository.findOne({
            where:{
                userId:user.id
            },
            relations:{
                students:true
            }
        })
        const students:Student[] = school.students;
        return students;
    }
    async getStudents(user:UserEntity,filterDto:FilterDto):Promise<Student[]>{
        const school = await this.schoolRepository.findOneBy({userId:user.id});
        const query = this.studentService.studentRepository.createQueryBuilder('student').where('student.schoolId = :id',{id:school.id})
        //console.log(await this.studentService.studentRepository.find({where:{userId:usersid}}))
        if(filterDto.search){
            query.andWhere('student.name Like :search',{search:`%${filterDto.search}%`})
        }
        if(filterDto.standard){
            query.andWhere('student.standard = :standard',{standard:filterDto.standard})
        }
        const studentArray: Student[] = await query.getMany();
        return studentArray;

        /*const studentSet = new Set<Student>();
        const studentArr = await this.getAllStudents(user);
        if(filterDto.search){
            studentArr.map((student)=>{
                if(student.name.includes(filterDto.search)){
                    studentSet.add(student);
                }
            })
        }

        if(filterDto.standard){
            studentArr.map((student)=>{
                if(student.standard===filterDto.standard){
                    studentSet.add(student);
                }
            })
        }
        if(Object.keys(filterDto).length==0){
            return studentArr;
        }
        const responseArray = Array.from(studentSet);
        return responseArray;*/
    }
    async updateSchool(user:UserEntity,schoolRequestDto:SchoolRequestDto):Promise<SchoolResponseDto>{
        //const result = await this.schoolRepository.update(id,schoolRequestDto);
        try{
            var school = await this.schoolRepository.findOneBy({userId:user.id});
        }
        catch(error){
            throw new NotFoundException('school not found');
        }
        
        const {name,address, board} = schoolRequestDto;
        school.name = name;
        school.address = address;
        school.board = board;
        try{
            await this.schoolRepository.save(school);
        }
        catch(error){
            throw new UnauthorizedException('cant perform the operation');
        }
        const response:SchoolResponseDto={
            name,
            address,
            board
        }
        return response;
    }
    async delete(user:UserEntity):Promise<SchoolResponseDto>{
        //const result = await this.getSchoolById(id);
        //await this.schoolRepository.delete(id);
        const school = await this.getMySchool(user);
        const {name,address,board} = school;
        try{
            this.schoolRepository.delete({userId:user.id})
       
        }
        catch(error){
            throw new UnauthorizedException();
        }
        const response:SchoolResponseDto={
            name,
            address,
            board
        }
        return response;

    }
    /*async deleteAll():Promise<string>{
        await this.schoolRepository.clear();
        return "all records deleted successfully";
    }*/
}
