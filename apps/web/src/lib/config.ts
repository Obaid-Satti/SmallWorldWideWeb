const localApiUrl = typeof window === "undefined"
  ? "http://localhost:3001"
  : `${window.location.protocol}//${window.location.hostname}:3001`;

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? localApiUrl;
