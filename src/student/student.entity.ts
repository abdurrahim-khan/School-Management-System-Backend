import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Standard } from "./student-enums/class.enum";
import { School } from "src/school/school.entity";

@Entity()
export class Student{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column()
    name:string;
    @Column()
    rollNo:string;
    @Column()
    age:number;
    @Column()
    standard:Standard;
    //@Column({type:'varchar', foreignKeyConstraintName:School})
    @ManyToOne(()=>School,(school)=>school.students/*,{eager:true}*/) //if eager:true then whenever student entity is fetched, its relation will also be fetched automatically, otherwise you will have to use leftjoinandselect in your querybuilder 
    //@JoinColumn() ----in @ManyToOne relations, @JoinColumn is automatically inserted by TypeOrm on the Many side
    school:School;
    @Column({nullable:true})
    userId:string;
}