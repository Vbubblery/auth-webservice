import { registerAs } from "@nestjs/config";

export default registerAs("coffee", () => {
  return {
    foo: "bar",
  };
});
