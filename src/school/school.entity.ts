import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Board } from "./school-enums/board.enum";
import { Student } from "src/student/student.entity";
import { UserEntity } from "src/auth/user.entity";
import { IsOptional } from "class-validator";

@Entity()
export class School{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    name:string;
    @Column()
    address:string;
    @Column()
    board:Board;
    //@Column({type:'varchar', array:true, nullable:true})
    @OneToMany(()=>Student,(student)=>student.school,{cascade:true})
    students:Student[];
    @Column({nullable:true})
    userId:string;
}