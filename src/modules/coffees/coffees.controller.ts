import { Protocol } from "@/commons/decorators/protocol.decorator";
import { Public } from "@/commons/decorators/public.decorator";
import { ParseIntPipe } from "@/commons/pipes/parse-int.pipe";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  // UseInterceptors
  // UseFilters
  // UseGuards
  ValidationPipe,
} from "@nestjs/common";
import { ApiForbiddenResponse, ApiTags } from "@nestjs/swagger";
import { CoffeesService } from "./coffees.service";
import { CreateCaffeeDto } from "./dto/create-caffee.dto";
import { PaginationQueryDto } from "./dto/pagination-query.dto";
import { UpdateCaffeeDto } from "./dto/update-caffee.dto";

@ApiTags("coffees")
// @UsePipes(ValidationPipe)
@Controller("coffees")
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @ApiForbiddenResponse({ description: "Forbidden" })
  @UsePipes(ValidationPipe)
  @Public()
  @Get()
  async findAll(
    @Protocol() protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(protocol);
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    console.log(typeof id);
    return this.coffeesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createCoffeeDto: CreateCaffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch("id")
  update(
    @Param("id") id: number,
    @Body(ValidationPipe) updateCoffeeDto: UpdateCaffeeDto,
  ) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete("id")
  remove(@Param("id") id: string) {
    return this.coffeesService.delete(+id);
  }
}
