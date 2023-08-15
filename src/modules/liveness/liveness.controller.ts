import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { LivenessService } from "./liveness.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("liveness")
@Controller("liveness")
export class LivenessController {
  constructor(private readonly livenessService: LivenessService) {}

  @Get("health-check")
  @HttpCode(HttpStatus.OK)
  getHealthCheck() {
    return this.livenessService.getHealthCheck();
  }

  @Get("bad-check")
  @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
  getBadCheck() {
    return this.livenessService.getBadCheck();
  }
}
