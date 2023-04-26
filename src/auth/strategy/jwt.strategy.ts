import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserEntity } from "../user.entity";
import { Repository } from "typeorm";
import { Payload } from "../interfaces/payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ){
        super({
            secretOrKey: 'this_is_my_top_secret_key',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }
    async validate(payload:Payload):Promise<UserEntity>{
        const {username,role} = payload;
        const user:UserEntity = await this.userRepository.findOneBy({username,role});
        return user;
    }
}
//all these strategies are used before calling the handler in controller class.
// first of all the accesstoken is verified using the above strategy and when it is verified
// then this validate function is called .....this is an overridden method and it is used to inject
// the userentity into the request body of the API call from the client
// so now all the handlers in the controller can have access to the userentity (as an object in request body)
// using @Req() decorator and then requestbody.user 
//only after the validate method has injected the userentity into the request body is when the handlers are
// finally called