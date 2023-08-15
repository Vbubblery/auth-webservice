import { Public } from "@/commons/decorators/public.decorator";
import { Query, Resolver } from "@nestjs/graphql";
import { CoffeesService } from "./coffees.service";
import { PaginationQueryDto } from "./dto/pagination-query.dto";
import { Coffee } from "./entities/coffee.entity";

@Resolver(() => Coffee)
export class CoffeesResolver {
  constructor(private readonly coffeesService: CoffeesService) {}
  @Query(() => [Coffee])
  async getAll(): Promise<Coffee[]> {
    const paginationQuery = {
      limit: 10,
      offset: 0,
    } as PaginationQueryDto;
    return await this.coffeesService.findAll(paginationQuery);
  }
}
