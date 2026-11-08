import {
  Controller,
  Get,
  Post,
  NotFoundException,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { SitesService, CreateSiteDto } from "./sites.service";

@Controller("sites")
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  async getAll() {
    return this.sitesService.findAll();
  }

  @Post()
  async create(@Body() body: CreateSiteDto) {
    return this.sitesService.create(body);
  }

  @Get(":address")
  async getByAddress(@Param("address") address: string) {
    const site = await this.sitesService.findByAddress(address);
    if (!site) {
      throw new NotFoundException({ message: "No site exists at this address." });
    }
    return site;
  }
}

@Controller("search")
export class SearchController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  async search(@Query("q") query: string = "") {
    return this.sitesService.search(query);
  }
}
