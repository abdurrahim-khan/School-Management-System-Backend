import { Inject, Injectable, NotFoundException, NotImplementedException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import { CreateStudentRequestDto } from './student-dtos/create-student-request.dto';
import { School } from 'src/school/school.entity';
import { StudentResponseDto } from './student-dtos/student-response.dto';
import { StudentRequestDto } from './student-dtos/student-request.dto';
import { SchoolService } from 'src/school/school.service';
import { UserDto } from 'src/auth/user-dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/auth/user.entity';
@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        public studentRepository: Repository<Student>,
        /*@InjectRepository(School)
        private schoolRepository: Repository<School>*/
        @Inject(forwardRef(() => SchoolService))
        private schoolService:SchoolService
    ){}
    
    async createStudent(createStudentRequestDto:CreateStudentRequestDto){
        const {name,age,rollNo,school,standard,userId} = createStudentRequestDto;
        //const schoolEntity = await this.schoolService.schoolRepository.createQueryBuilder('school').andWhere('school.name = :name AND school.address = :address AND school.board = :board',{name:school.name,address:school.address,board:school.board}).getOne();
        const schoolEntity = await this.schoolService.schoolRepository.findOne({
            where:{
                name:school.name,
                address:school.address,
                board:school.board
            }
        })
        if(!schoolEntity){
            throw new NotFoundException('school doesnt exist');
        }
        const student = this.studentRepository.create({
            name,
            age,
            rollNo,
            standard,
            school:schoolEntity,
            userId
        })
        //console.log(schoolEntity)
       /* if(schoolEntity.students === null)
        {
            const arr:Student[] = [];
            schoolEntity.students = arr;
        }
        schoolEntity.students.push(student);
        console.log(schoolEntity)
        try{
            await this.schoolService.schoolRepository.update(schoolEntity.id, schoolEntity);
        }
        catch(e){

            throw new NotImplementedException('could not add student1');
        }
        console.log("one")*/
        try{
            const result = await this.studentRepository.save(student);
        }
        catch(e){
            throw new NotImplementedException('could not add student2');
        }
        //console.log("two")
        const response:StudentResponseDto={
            name,
            age,
            rollNo,
            standard,
            school:school.name
        }
        //console.log("three")
        return response;
    }
    async getStudentByIdInner(id:string):Promise<Student>{
        const result = await this.studentRepository.find({
            where:{
                id:id
            },
            relations:{
                school:true,
            }
        });
        //instead of using relations roperty here
        // you could have made use of eager property in @ManyToOne() decorator
        // after current relation and inverse relation, add another argument
        // {eager: true}
        // now whenver student entity will be fetched, automatically its relation will be fetched
        // which in this case is school object
        // but this eager proprtry works only when we use find() function
        // if we try to use querybuilder, then it doesnt work
        //in that case, we need to use leftjoinandselect property
        if(result.length==0)
        {
            throw new NotFoundException('student doesnt exist');
        }
        return result[0];
    }
    async getStudentByIdOuter(id:string):Promise<StudentResponseDto>{
        const result = await this.getStudentByIdInner(id);
        if(!result){
            throw new NotFoundException('student doesnt exist');
        }
        const {name,age,rollNo,standard,school} = result;
        console.log(result)
        const response:StudentResponseDto={
            name,
            age,
            rollNo,
            standard,
            school:school.name
        }
        return response;
    }
    async getMyDetails(user:UserEntity):Promise<Student>{
        const student = await this.studentRepository.findOne({
            where:{userId:user.id},
            relations:{
                school:true
            }
        }
        );
        return student;
    }
    async updateStudent(user:UserEntity,studentRequestDto:StudentRequestDto){
        //const result = await this.getStudentByIdInner(id);
        const result = await  this.getMyDetails(user);
        const {name,age,rollNo,standard,school} = studentRequestDto;
        //const schoolEntity = await this.schoolService.schoolRepository.createQueryBuilder('school').andWhere('school.name = :name AND school.address = :address AND school.board = :board',{name:school.name,address:school.address,board:school.board}).getOne();
        const schoolEntity = await this.schoolService.schoolRepository.findOne({
            where:{
                name:school.name,
                address:school.address,
                board:school.board
            },
            relations:{
                students: true
            }
        })
        if(!schoolEntity){
            throw new NotFoundException('given school doesnt exist')
        }
        console.log(result)
        result.age = age;
        result.name = name;
        result.rollNo = rollNo;
        result.standard = standard;
        result.school = schoolEntity;
        try{
            await this.studentRepository.save(result);
        }
        catch(e)
        {
            throw new NotImplementedException('update failed');
        }
        const response:StudentResponseDto={
            name,
            age,
            rollNo,
            standard,
            school:school.name
        }
        return response;
    }
    /*async deleteAll():Promise<string>{
        await this.studentRepository.clear();
        return "all records deleted";
    }*/
    async delete(user:UserEntity):Promise<StudentResponseDto>{
        //const result = await this.getStudentByIdOuter(id);
        const result = await this.getMyDetails(user);
        const {name,rollNo,age,standard,school} = result;
        await this.studentRepository.delete(result);
        const response:StudentResponseDto={
            name,
            rollNo,
            age,
            standard,
            school:school.name
        }
        return response;
    }
}
