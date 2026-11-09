import { test, expect } from "@playwright/test";
import standards from "../src/data/standards.json" with { type: "json" };
test("dashboard, verified standards and unfinished modules", async ({
  page,
}) => {
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Hello, Michigan explorer!" }),
  ).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/michigan-explorer-academy/");
  const assetPaths = await page
    .locator('script[src], link[rel="stylesheet"]')
    .evaluateAll((elements) =>
      elements.map(
        (element) =>
          new URL(
            element.getAttribute("src") || element.getAttribute("href")!,
            location.href,
          ).pathname,
      ),
    );
  expect(assetPaths.length).toBeGreaterThan(0);
  expect(
    assetPaths.every((path) =>
      path.startsWith("/michigan-explorer-academy/assets/"),
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/dashboard-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("link", { name: "View all standards" }).click();
  await expect(
    page.getByRole("heading", { name: "Standards explorer" }),
  ).toBeVisible();
  await page.getByPlaceholder("Try a code, topic, or keyword").fill("3-H3.0.4");
  await expect(
    page.getByText("Draw upon traditional stories", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Explore lesson" }).click();
  await expect(
    page.getByRole("heading", { name: "Teachings that carry forward" }),
  ).toBeVisible();
  await page.goto("./#Geography");
  await expect(
    page.getByText(
      "Lessons, activities, and assessments are not yet developed",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(page.locator(".standard-card")).toHaveCount(11);
});
test("assessment mastery needs two rounds and persists across reloads", async ({
  page,
}) => {
  const s = standards[0];
  await page.goto("./#standard/" + s.code);
  for (let round = 0; round < 2; round++) {
    await page
      .getByRole("button", { name: `Assessment round ${round + 1}` })
      .click();
    for (let i = 0; i < 5; i++) {
      const q = s.assessments[round][i];
      await page.getByLabel(q.options[q.answer], { exact: true }).check();
      await page
        .getByRole("button", {
          name: i === 4 ? "See my results" : "Next question →",
        })
        .click();
    }
    await expect(page.getByText("5 / 5", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Back to lesson" }).click();
    if (round === 0)
      await expect(
        page.getByText("Skill mastered!", { exact: false }),
      ).toHaveCount(0);
  }
  await expect(
    page.getByText("Skill mastered!", { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Skill mastered!", { exact: false }),
  ).toBeVisible();
});
test("wrong practice answers provide feedback and targeted review", async ({
  page,
}) => {
  const s = standards[1];
  await page.goto("./#standard/" + s.code);
  await page.getByRole("button", { name: "Practice this skill" }).click();
  for (let i = 0; i < 5; i++) {
    const q = s.practice[i];
    await page
      .getByLabel(q.options[(q.answer + 1) % q.options.length], { exact: true })
      .check();
    await page.getByRole("button", { name: "Check answer" }).click();
    await expect(page.getByText(q.explanation, { exact: false })).toBeVisible();
    await page
      .getByRole("button", {
        name: i === 4 ? "See my results" : "Next question →",
      })
      .click();
  }
  await page.getByRole("button", { name: "Back to lesson" }).click();
  await page
    .getByRole("button", { name: "Review missed questions (5)" })
    .click();
  await expect(
    page.getByText("Question 1 of 5", { exact: true }),
  ).toBeVisible();
});
test("keyboard controls order a timeline and classify evidence", async ({
  page,
}) => {
  await page.goto("./#standard/3-H3.0.10");
  await page.getByRole("button", { name: "Move 1701 earlier" }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Move 1825 earlier" }).click();
  await page.getByRole("button", { name: "Move 1825 earlier" }).click();
  await page.getByRole("button", { name: "Check my timeline" }).click();
  await expect(page.getByText("You did it!", { exact: false })).toBeVisible();
  await page.goto("./#standard/3-H3.0.2");
  await page
    .getByRole("button", { name: "Primary source", exact: true })
    .first()
    .click();
  await expect(page.getByText("That’s right!", { exact: false })).toBeVisible();
});
test("responsive layout and no third-party requests", async ({ page }) => {
  const remote: string[] = [];
  const origin = new URL(test.info().project.use.baseURL!).origin;
  page.on("request", (r) => {
    if (new URL(r.url()).origin !== origin) remote.push(r.url());
  });
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Hello, Michigan explorer!" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator("body")).toBeVisible();
  expect(remote).toEqual([]);
  await page.goto("./#about");
  await expect(
    page.getByRole("heading", { name: "Unofficial educational project" }),
  ).toBeVisible();
});
