import { Role } from "src/enums/role.enum";
import { School } from "src/school/school.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class UserEntity{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column({unique:true})
    username:string;
    @Column()
    password:string;
    @Column()
    role:Role;
}