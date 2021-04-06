import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as config from "config";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const serverConfig = config.get("server");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(join(__dirname, "..", "uploads/images"));
  await app.listen(process.env.PORT || serverConfig.port);
}
bootstrap();
