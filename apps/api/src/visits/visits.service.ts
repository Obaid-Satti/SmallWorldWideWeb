import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Visit, VisitDocument } from "./visit.schema";

export type CreateVisitDto = {
  person: string;
  address: string;
  title: string;
  method?: "typed" | "link" | "history" | "search";
};

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private readonly visitModel: Model<VisitDocument>,
  ) {}

  create(data: CreateVisitDto) {
    const person = data.person?.trim();
    const address = data.address?.trim().toLowerCase();
    const title = data.title?.trim();
    const method = data.method ?? "typed";

    if (!person || !address || !title) {
      throw new BadRequestException("Person, address, and title are required.");
    }
    if (!["typed", "link", "history", "search"].includes(method)) {
      throw new BadRequestException("Visit method must be typed, link, history, or search.");
    }

    return this.visitModel.create({ person, address, title, method, visitedAt: new Date() });
  }

  findByPerson(person: string) {
    const name = person?.trim();
    if (!name) throw new BadRequestException("A person name is required.");

    return this.visitModel
      .find({ person: name })
      .select("person address title method visitedAt")
      .sort({ visitedAt: -1, _id: -1 })
      .lean()
      .exec();
  }
}
