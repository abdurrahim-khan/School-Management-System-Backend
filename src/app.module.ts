import { Module } from '@nestjs/common';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [SchoolModule, StudentModule,AuthModule,TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:5432,
    database:'school-management-system',
    username:'postgres',
    password:'root',
    autoLoadEntities:true,
    synchronize:true,
  })]
})
export class AppModule {}
