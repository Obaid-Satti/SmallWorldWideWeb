import type { SearchResult } from "../types";

export async function searchSites(query: string): Promise<SearchResult[]> {
  const apiUrl = process.env.API_URL ?? "http://localhost:3001";

  try {
    const response = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
    if (!response.ok) return [];
    return (await response.json()) as SearchResult[];
  } catch {
    return [];
  }
}
