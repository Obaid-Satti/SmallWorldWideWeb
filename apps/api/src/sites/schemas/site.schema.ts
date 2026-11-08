import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type SiteDocument = HydratedDocument<Site>;

@Schema({ timestamps: true })
export class Site {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  address!: string;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true })
  html!: string;

  @Prop({ required: true, trim: true })
  author!: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
SiteSchema.index({ title: "text", html: "text", author: "text" });
