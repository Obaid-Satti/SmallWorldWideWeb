import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = [
    "http://localhost:3002",
    "http://localhost:3000",
    process.env.WEB_ORIGIN,
  ].filter(Boolean) as string[];

  app.enableCors({ origin: allowedOrigins });
  await app.listen(process.env.API_PORT ?? 3001);
}

void bootstrap();
