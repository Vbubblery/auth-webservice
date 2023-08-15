import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Graphql
    if (<string>context.getType() === "graphql") {
      const ctx = GqlExecutionContext.create(context);
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [ctx.getHandler(), ctx.getClass()],
      );
      if (isPublic) return true;
      const { req } = ctx.getContext();
      const apiKey = req.header("api-key");
      return apiKey === this.configService.get("API_KEY");
      // http
    } else {
      const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
      if (isPublic) return true;
      const request = context.switchToHttp().getRequest<Request>();
      const apiKey = request.header("api-key");
      return apiKey === this.configService.get("API_KEY");
    }
    return true;
  }
}
