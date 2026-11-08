import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuredOrigins = (process.env.WEB_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = [
    "http://localhost:3002",
    "http://localhost:3000",
    ...configuredOrigins,
  ];
  const localNetworkWebOrigin = /^http:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):3002$/;

  app.enableCors({
    origin: (origin, callback) => {
      const allowed =
        !origin ||
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" && localNetworkWebOrigin.test(origin));
      callback(null, allowed);
    },
  });
  await app.listen(process.env.API_PORT ?? 3001, "0.0.0.0");
}

void bootstrap();
