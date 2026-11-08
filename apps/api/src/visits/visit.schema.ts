import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type VisitDocument = HydratedDocument<Visit>;

@Schema({ timestamps: false })
export class Visit {
  @Prop({ required: true, trim: true, index: true })
  person!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  address!: string;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, enum: ["typed", "link", "history", "search"] })
  method!: "typed" | "link" | "history" | "search";

  @Prop({ required: true, default: Date.now, index: true })
  visitedAt!: Date;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
VisitSchema.index({ person: 1, visitedAt: -1 });
