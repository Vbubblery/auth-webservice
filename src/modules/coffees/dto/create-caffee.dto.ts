import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCaffeeDto {
  @ApiProperty({ description: "The name of coffee" })
  @IsString()
  readonly name: string;
  @IsString()
  readonly brand: string;
  @ApiProperty({ example: [] })
  @IsString({ each: true })
  readonly flavors: string[];
}
