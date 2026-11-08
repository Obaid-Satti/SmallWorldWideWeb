import { Injectable, ConflictException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Site, SiteDocument } from "./schemas/site.schema";

export interface CreateSiteDto {
  address: string;
  title: string;
  author: string;
  html: string;
}

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name) private readonly siteModel: Model<SiteDocument>,
  ) {}

  findAll() {
    return this.siteModel
      .find()
      .select("address title author createdAt updatedAt")
      .sort({ address: 1 })
      .lean()
      .exec();
  }

  findByAddress(address: string) {
    return this.siteModel
      .findOne({ address: address.trim().toLowerCase() })
      .select("address title html author createdAt updatedAt")
      .lean()
      .exec();
  }

  async create(data: CreateSiteDto) {
    const cleanAddress = data.address.trim().toLowerCase();
    
    // Address format validation: word.word
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(cleanAddress)) {
      throw new BadRequestException("Address must be a valid domain-like shape (e.g. site.zz).");
    }
    if (!data.title?.trim()) {
      throw new BadRequestException("Title is required.");
    }
    if (!data.author?.trim()) {
      throw new BadRequestException("Author name is required.");
    }
    if (!data.html?.trim()) {
      throw new BadRequestException("HTML page content is required.");
    }

    const existing = await this.siteModel.findOne({ address: cleanAddress }).lean().exec();
    if (existing) {
      throw new ConflictException(`A site already lives at address '${cleanAddress}'.`);
    }

    const created = await this.siteModel.create({
      address: cleanAddress,
      title: data.title.trim(),
      author: data.author.trim(),
      html: data.html.trim(),
    });

    return created;
  }

  async search(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return [];

    // Search by regex across title, author, and html
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    const matches = await this.siteModel
      .find({
        $or: [
          { title: regex },
          { author: regex },
          { address: regex },
          { html: regex },
        ],
      })
      .select("address title author html createdAt")
      .lean()
      .exec();

    // Extract snippet surrounding the match for rich preview
    return matches.map((site) => {
      // Strip HTML tags for clean text excerpt
      const plainText = site.html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
      const matchIndex = plainText.toLowerCase().indexOf(trimmed.toLowerCase());
      
      let snippet = "";
      if (matchIndex !== -1) {
        const start = Math.max(0, matchIndex - 50);
        const end = Math.min(plainText.length, matchIndex + trimmed.length + 70);
        snippet = (start > 0 ? "…" : "") + plainText.substring(start, end) + (end < plainText.length ? "…" : "");
      } else {
        snippet = plainText.substring(0, 110) + (plainText.length > 110 ? "…" : "");
      }

      return {
        address: site.address,
        title: site.title,
        author: site.author,
        snippet,
        createdAt: site.createdAt,
      };
    });
  }
}
