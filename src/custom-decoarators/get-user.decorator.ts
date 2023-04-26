import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserEntity } from "src/auth/user.entity";

export const GetUser = createParamDecorator((data,context:ExecutionContext):UserEntity=>{
    const requestbody = context.switchToHttp().getRequest();
    const user:UserEntity = requestbody.user;
    return user;
})