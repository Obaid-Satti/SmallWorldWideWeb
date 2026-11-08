import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Site, SiteSchema } from "./schemas/site.schema";
import { Person, PersonSchema } from "../people/person.schema";
import { SitesController, SearchController } from "./sites.controller";
import { SitesService } from "./sites.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Site.name, schema: SiteSchema },
      { name: Person.name, schema: PersonSchema },
    ]),
  ],
  controllers: [SitesController, SearchController],
  providers: [SitesService],
  exports: [SitesService],
})
export class SitesModule {}
