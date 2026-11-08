import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreateVisitDto, VisitsService } from "./visits.service";

@Controller("visits")
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get()
  findByPerson(@Query("person") person = "") {
    return this.visitsService.findByPerson(person);
  }

  @Post()
  create(@Body() body: CreateVisitDto) {
    return this.visitsService.create(body);
  }
}
