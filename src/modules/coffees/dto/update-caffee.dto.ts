import { PartialType } from "@nestjs/swagger";
import { CreateCaffeeDto } from "./create-caffee.dto";

export class UpdateCaffeeDto extends PartialType(CreateCaffeeDto) {}
