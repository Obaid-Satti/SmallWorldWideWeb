import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Site, SiteSchema } from "./schemas/site.schema";
import { SitesController, SearchController } from "./sites.controller";
import { SitesService } from "./sites.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
  ],
  controllers: [SitesController, SearchController],
  providers: [SitesService],
  exports: [SitesService],
})
export class SitesModule {}
