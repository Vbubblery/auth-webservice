import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService, ConfigType } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { COFFEE_BRANDS } from "./coffees.constants";
import coffeeConfig from "./configs/coffee.config";
import { CreateCaffeeDto } from "./dto/create-caffee.dto";
import { PaginationQueryDto } from "./dto/pagination-query.dto";
import { UpdateCaffeeDto } from "./dto/update-caffee.dto";
import { Coffee } from "./entities/coffee.entity";
import { Event } from "./entities/event.entity";
import { Flavor } from "./entities/flavor.entity";

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly FlavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    @Inject(COFFEE_BRANDS)
    coffeeBrands: string[],
    private readonly configService: ConfigService,
    @Inject(coffeeConfig.KEY)
    private readonly coffeeConfiguration: ConfigType<typeof coffeeConfig>,
  ) {
    console.log(coffeeBrands);
    console.log(this.configService.get<string>("DB_NAME"));
    console.log(this.configService.get("database.host"));
    console.log(this.configService.get("coffee.foo"));
    console.log(this.coffeeConfiguration.foo);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ["flavors"],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const rawData = await this.dataSource.query(
      `SELECT * FROM coffees WHERE id=${id}`,
    );
    // return rawData[0]
    const coffee = await this.coffeeRepository.findOneBy({ id });
    console.log(coffee);
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} is not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCaffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.payloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCaffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.payloadFlavorByName(name)),
      ));
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async delete(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = "recommend_coffee";
      recommendEvent.type = "coffee";
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }

  private async payloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.FlavorRepository.findOneBy({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.FlavorRepository.create({ name });
  }
}
