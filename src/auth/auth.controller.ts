import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserDto } from './user-dto/user.dto';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { SigninResponse } from './interfaces/signin-response.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService
    ){}
    @Post('/signup')
    async signup(@Body() userDto:UserDto):Promise<UserEntity>{
        console.log(userDto);
        return await this.authService.createUser(userDto);
    }
    @Get('/signin')
    async signin(@Body() userDto:UserDto):Promise<SigninResponse>{
        return await this.authService.getUser(userDto);
    }
    /*
    @Post('/test')
    @UseGuards(AuthGuard()) // this is a guard....now this handler will be called only when the API request carries the access token 
    async test(@Req() requestbody){
        console.log(requestbody);
    }*/
}
//basically these @Body() @Params() @Query() decorators are actually functions and they extract body property,
// params property, query property respectively from the request object that is recived from the API call.
// @Req decorator basically return the entire request object

// guards can be of different types
// handler level guards that guard only a single handler
// controller level guard that guards the entire controller class
// application level guard that guards the entire appliction(i.e. all the controllers of the app)

// these classifications are exactly like that of pipes
// pipes also can be of the above three types

// pipes are also invoked before calling the handlers

