import { Injectable } from "@nestjs/common";

@Injectable()
export class LivenessService {
  getHealthCheck() {
    return "Health check passed.";
  }
  getBadCheck() {
    return "Health check did not pass";
  }
}
