import type { Site } from "../types";

export async function getSiteByAddress(address: string): Promise<Site | null> {
  const apiUrl = process.env.API_URL ?? "http://localhost:3001";
  try {
    const response = await fetch(`${apiUrl}/sites/${encodeURIComponent(address)}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as Site;
  } catch {
    return null;
  }
}
