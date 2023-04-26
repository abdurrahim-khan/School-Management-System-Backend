import { Module, forwardRef } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './school.entity';
import { StudentModule } from 'src/student/student.module';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
  imports: [forwardRef(()=>AuthModule),/*forwardRef(()=>StudentModule)*/StudentModule,TypeOrmModule.forFeature([School])],
  exports: [SchoolService],
})
export class SchoolModule {}
