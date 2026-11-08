import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { HealthController } from "./health/health.controller";
import { SitesModule } from "./sites/sites.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "../../.env" }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("MONGODB_URI", "mongodb://localhost:27017/small_web"),
      }),
    }),
    SitesModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
