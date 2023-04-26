import { Module, forwardRef } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import {TypeOrmModule} from '@nestjs/typeorm'
import { Student } from './student.entity';
import { SchoolModule } from 'src/school/school.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [forwardRef(()=>AuthModule),forwardRef(()=>SchoolModule),TypeOrmModule.forFeature([Student])],
  exports: [StudentService]
})
export class StudentModule {}
