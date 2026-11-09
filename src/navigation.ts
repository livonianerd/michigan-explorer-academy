export type Route = { view: string; code?: string };
export function parseRoute(hash: string): Route {
  const [rawView, code] = hash.replace(/^#/, "").split("/");
  try {
    return { view: decodeURIComponent(rawView || "home"), code };
  } catch {
    return { view: "unknown" };
  }
}
