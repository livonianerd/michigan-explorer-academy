import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const lock = JSON.parse(
  readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"),
);
describe("reproducible registry installs", () => {
  it("uses canonical npm tarball paths, including scoped package basenames", () => {
    for (const [path, entry] of Object.entries(lock.packages) as [
      string,
      { version: string; resolved?: string },
    ][]) {
      if (!entry.resolved) continue;
      const name = path.split("node_modules/").at(-1)!;
      const basename = name.split("/").at(-1);
      expect(entry.resolved, name).toBe(
        `https://registry.npmjs.org/${name}/-/${basename}-${entry.version}.tgz`,
      );
    }
  });
});
