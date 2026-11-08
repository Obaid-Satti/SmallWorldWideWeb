import type { SearchResult, Site } from "@/types/site";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getSiteByAddress(address: string): Promise<Site | null> {
  try {
    const response = await fetch(`${API_URL}/sites/${encodeURIComponent(address)}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as Site;
  } catch {
    return null;
  }
}

export async function searchSites(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
    if (!response.ok) return [];
    return (await response.json()) as SearchResult[];
  } catch {
    return [];
  }
}
