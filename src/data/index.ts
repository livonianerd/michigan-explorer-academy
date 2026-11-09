import raw from "./standards.json";
import { standardSchema } from "./schema";
export const standards = standardSchema.array().parse(raw);
export const history = standards.filter((s) => s.module === "History");
export const modules = [
  "History",
  "Geography",
  "Civics and Government",
  "Economics",
  "Public Discourse",
] as const;
