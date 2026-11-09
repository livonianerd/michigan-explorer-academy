import { describe, it, expect } from "vitest";
import { parseRoute } from "./navigation";
describe("subpath-safe hash navigation", () => {
  it("opens the dashboard for an empty hash", () => {
    expect(parseRoute("")).toEqual({ view: "home", code: undefined });
    expect(parseRoute("#")).toEqual({ view: "home", code: undefined });
  });
  it("decodes module names containing spaces", () => {
    expect(parseRoute("#Civics%20and%20Government").view).toBe(
      "Civics and Government",
    );
    expect(parseRoute("#Public%20Discourse").view).toBe("Public Discourse");
  });
  it("keeps standard codes and handles malformed encodings safely", () => {
    expect(parseRoute("#standard/3-H3.0.10")).toEqual({
      view: "standard",
      code: "3-H3.0.10",
    });
    expect(parseRoute("#%broken").view).toBe("unknown");
  });
});
