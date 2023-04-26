import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SchoolModule } from 'src/school/school.module';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports:[forwardRef(()=>SchoolModule) , forwardRef(()=>StudentModule),
  PassportModule.register({defaultStrategy:'jwt'}),
  JwtModule.register({
    secret:'this_is_my_top_secret_key',
    signOptions:{
    expiresIn: 3600
    }
  }),
  TypeOrmModule.forFeature([UserEntity])],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule,JwtStrategy]
})
export class AuthModule {}
