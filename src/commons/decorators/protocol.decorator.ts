import { createParamDecorator, ExecutionContext } from "@nestjs/common";
export const Protocol = createParamDecorator(
  (defaultData: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
  },
);
