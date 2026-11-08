export type Visit = {
  _id: string;
  person: string;
  address: string;
  title: string;
  method: "typed" | "link" | "history" | "search";
  visitedAt: string;
};
