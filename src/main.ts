import apm from "elastic-apm-node";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./commons/filters/http-exception.filter";
import { ApiKeyGuard } from "./commons/guards/api-key.guard";
import { WrapResponseInterceptor } from "./commons/interceptors/wrap-response.interceptor";
import { TimeoutInterceptor } from "./commons/interceptors/timeout.interceptor";

async function bootstrap() {
  apm.start({
    serviceName: process.env.APM_SERVICE_NAME,
    secretToken: process.env.APM_SECRET_TOKEN,
    serverUrl: process.env.APM_SERVER_URL,
    environment: process.env.APM_ENVIRONMENT,
    active: process.env.APM_ACTIVE === "true",
  });

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // auto transform the type of params
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalGuards(new ApiKeyGuard());
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );

  const options = new DocumentBuilder()
    .setTitle("nest-template")
    .setDescription("flowlity nest template")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(3000);
}
bootstrap();
