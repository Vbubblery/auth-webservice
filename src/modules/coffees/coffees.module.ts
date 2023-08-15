import { Injectable, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { COFFEE_BRANDS } from "./coffees.constants";
import { CoffeesController } from "./coffees.controller";
import { CoffeesService } from "./coffees.service";
import coffeeConfig from "./configs/coffee.config";
import { Coffee } from "./entities/coffee.entity";
import { Event } from "./entities/event.entity";
import { Flavor } from "./entities/flavor.entity";
import { CoffeesResolver } from "./coffees.resolver";

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return ["nescafe", "buddy brew"];
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeeConfig),
  ],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === "development"
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    // GraphQL supports
    CoffeesResolver,
    // { provide: COFFEE_BRANDS, useValue: ["nescafe", "buddy brew"] },
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: (brandsFactory: CoffeeBrandsFactory) =>
    //     brandsFactory.create(),
    //   inject: [CoffeeBrandsFactory],
    // },
    {
      provide: COFFEE_BRANDS,
      useFactory: async (dataSource: DataSource): Promise<string[]> => {
        // select * from coffee_brands
        const coffeeBrands = await Promise.resolve(["nescafe", "buddy brew"]);
        return coffeeBrands;
      },
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
