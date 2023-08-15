import { Module, ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LivenessModule } from "./modules/liveness/liveness.module";
import { CoffeesModule } from "./modules/coffees/coffees.module";
import { CoffeeRatingModule } from "./modules/coffee-rating/coffee-rating.module";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "@hapi/joi";
import appConfig from "./configs/app.config";
import { APP_PIPE } from "@nestjs/core";
import { CommonsModule } from "./commons/commons.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import * as path from "path";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.required(),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().default("postgres"),
        DB_NAME: Joi.required(),
        DB_PSWD: Joi.required(),
        APM_ACTIVE: Joi.boolean().default(false),
      }),
      envFilePath: ".env",
      ignoreEnvFile: false,
      load: [appConfig],
    }),
    LivenessModule,
    CoffeesModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres",
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PSWD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: path.join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
    }),
    CoffeeRatingModule,
    CommonsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe,
    // },
  ],
})
export class AppModule {}
