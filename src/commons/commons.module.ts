import { MiddlewareConsumer, NestModule, RequestMethod } from "@nestjs/common";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ApiKeyGuard } from "./guards/api-key.guard";
import { LoggingMiddleware } from "./middlewares/logging.middleware";

@Module({
  imports: [ConfigModule],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class CommonsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      // .exclude()
      .forRoutes({ path: "coffees/*", method: RequestMethod.ALL });
  }
}
