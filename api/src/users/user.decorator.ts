import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//Декоратор пользователя
export const UserDecor = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return { ...user };
  });
