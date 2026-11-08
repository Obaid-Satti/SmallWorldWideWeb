export type Site = {
  address: string;
  title: string;
  html: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SearchResult = {
  address: string;
  title: string;
  author: string;
  snippet: string;
  createdAt?: string;
};
