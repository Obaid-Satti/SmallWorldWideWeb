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

    const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    const sites = await this.siteModel
      .find()
      .select("address title author html createdAt")
      .sort({ address: 1 })
      .lean()
      .exec();

    const results = sites.flatMap((site) => {
      const plainText = site.html
        .replace(/<!--[\s\S]*?-->/g, " ")
        .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
      const searchableText = `${site.title} ${site.author} ${site.address} ${plainText}`.toLowerCase();
      if (!terms.every((term) => searchableText.includes(term))) return [];
      const addressMatch = terms.every((term) => site.address.toLowerCase().includes(term));

      const textMatchIndex = plainText.toLowerCase().indexOf(terms[0]);
      const start = textMatchIndex < 0 ? 0 : Math.max(0, textMatchIndex - 50);
      const end = Math.min(plainText.length, (textMatchIndex < 0 ? 0 : textMatchIndex) + 120);
      const snippet = `${start > 0 ? "…" : ""}${plainText.substring(start, end)}${end < plainText.length ? "…" : ""}`;

      return [{
        address: site.address,
        title: site.title,
        author: site.author,
        snippet,
        createdAt: site.createdAt,
        matchType: addressMatch ? "address" : "content",
      }];
    });

    return results.sort((left, right) => {
      if (left.matchType === right.matchType) return 0;
      return left.matchType === "address" ? -1 : 1;
    });
  }
}
