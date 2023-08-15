import { Test, TestingModule } from "@nestjs/testing";
import { LivenessService } from "./liveness.service";

describe("LivenessService", () => {
  let service: LivenessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LivenessService],
    }).compile();

    service = module.get<LivenessService>(LivenessService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
