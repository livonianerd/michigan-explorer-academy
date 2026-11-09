import { describe, it, expect, vi, afterEach } from "vitest";
import { history, standards } from "./data";
import { standardSchema } from "./data/schema";
import {
  grade,
  isMastered,
  passedRounds,
  emptyProgress,
  loadProgress,
  saveProgress,
  missedQuestions,
  type Attempt,
} from "./progress";
const s = history[0];
function attempt(round: number, correct = 5): Attempt {
  return {
    standard: s.code,
    mode: "assessment",
    round,
    at: Date.now(),
    answers: Object.fromEntries(
      s.assessments[round].map((q, i) => [
        q.id,
        i < correct ? q.answer : (q.answer + 1) % q.options.length,
      ]),
    ),
  };
}
describe("grading and mastery", () => {
  it("grades unanswered questions as missed and never passes an empty bank", () => {
    expect(grade(s.practice, {}).score).toBe(0);
    expect(grade([], {}).score).toBe(0);
  });
  it("requires 80 percent on each of two distinct rounds", () => {
    const p = emptyProgress();
    p.attempts.push(attempt(0, 4));
    expect(isMastered(s, p)).toBe(false);
    p.attempts.push(attempt(1, 3));
    expect(isMastered(s, p)).toBe(false);
    p.attempts.push(attempt(1, 4));
    expect(isMastered(s, p)).toBe(true);
  });
  it("does not count repeat passes of one round as two", () => {
    expect(
      isMastered(s, { version: 1, attempts: [attempt(0), attempt(0)] }),
    ).toBe(false);
  });
  it("does not count practice or a different standard", () => {
    expect(
      isMastered(s, {
        version: 1,
        attempts: [
          { ...attempt(0), mode: "practice" },
          { ...attempt(1), standard: "other" },
        ],
      }),
    ).toBe(false);
  });
  it("refuses mastery if banks reuse questions", () => {
    expect(
      isMastered(
        { ...s, assessments: [s.assessments[0], s.assessments[0]] },
        { version: 1, attempts: [attempt(0), attempt(1)] },
      ),
    ).toBe(false);
  });
  it("requires enough questions in each round", () => {
    expect(
      passedRounds(
        { ...s, assessments: [s.assessments[0].slice(0, 1)] },
        { version: 1, attempts: [attempt(0)] },
      ),
    ).toEqual([false]);
  });
  it("keeps passed rounds after a later unsuccessful try", () => {
    expect(
      isMastered(s, {
        version: 1,
        attempts: [attempt(0), attempt(1), attempt(0, 0)],
      }),
    ).toBe(true);
  });
  it("targets missed questions and removes corrected ones", () => {
    const p = { version: 1 as const, attempts: [attempt(0, 3)] };
    expect(missedQuestions(s, p)).toHaveLength(2);
    p.attempts.push(attempt(0));
    expect(missedQuestions(s, p)).toHaveLength(0);
  });
});
describe("content contract", () => {
  it("covers every Grade 3 content expectation exactly once", () => {
    expect(standards).toHaveLength(42);
    expect(new Set(standards.map((s) => s.code)).size).toBe(42);
    expect(history.map((s) => s.code)).toEqual(
      Array.from({ length: 10 }, (_, i) => `3-H3.0.${i + 1}`),
    );
    expect(standards.filter((s) => s.module === "Geography")).toHaveLength(11);
    expect(
      standards.filter((s) => s.module === "Civics and Government"),
    ).toHaveLength(8);
    expect(standards.filter((s) => s.module === "Economics")).toHaveLength(7);
    expect(
      standards.filter((s) => s.module === "Public Discourse"),
    ).toHaveLength(6);
  });
  it("validates all data with source and page references", () => {
    standards.forEach((s) => {
      expect(standardSchema.safeParse(s).success).toBe(true);
      expect(s.source.verified).toBe(true);
      expect(s.source.page).toBeGreaterThanOrEqual(30);
      expect(s.source.page).toBeLessThanOrEqual(35);
    });
  });
  it("has complete History lessons and distinct assessment banks", () => {
    history.forEach((s) => {
      expect(s.status).toBe("ready");
      expect(s.lessons.length).toBeGreaterThan(0);
      expect(s.objectives.length).toBeGreaterThan(0);
      expect(s.activities.length).toBeGreaterThan(0);
      expect(s.practice.length).toBeGreaterThanOrEqual(5);
      expect(s.assessments).toHaveLength(2);
      expect(new Set(s.assessments.flat().map((q) => q.id)).size).toBe(10);
      s.assessments.forEach((b) => expect(b).toHaveLength(5));
    });
  });
  it("keeps undeveloped modules clearly marked", () => {
    standards
      .filter((s) => s.module !== "History")
      .forEach((s) => {
        expect(s.status).toBe("planned");
        expect(s.lessons).toHaveLength(0);
      });
  });
  it("rejects out-of-range answer indices", () => {
    const changed = { ...s, practice: [{ ...s.practice[0], answer: 99 }] };
    expect(standardSchema.safeParse(changed).success).toBe(false);
  });
});
describe("resilient local storage", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("survives corrupt or inaccessible storage", () => {
    vi.stubGlobal("localStorage", { getItem: () => "{bad" });
    expect(loadProgress()).toEqual(emptyProgress());
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw Error();
      },
      setItem: () => {
        throw Error();
      },
    });
    expect(loadProgress()).toEqual(emptyProgress());
    expect(saveProgress(emptyProgress())).toBe(false);
  });
  it("validates persisted progress version", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => JSON.stringify({ version: 9, attempts: [] }),
    });
    expect(loadProgress()).toEqual(emptyProgress());
  });
  it("round trips valid anonymous attempts", () => {
    let stored = "";
    vi.stubGlobal("localStorage", {
      getItem: () => stored,
      setItem: (_: string, v: string) => (stored = v),
    });
    const p = { version: 1 as const, attempts: [attempt(0)] };
    expect(saveProgress(p)).toBe(true);
    expect(loadProgress()).toEqual(p);
  });
});
import processSkills from "./data/process-skills.json";
import {
  timelineEvents,
  sourceCards,
  environmentEvidence,
} from "./data/activities";
describe("shared reference and activity data", () => {
  it("preserves all 17 shared process skills separately", () => {
    expect(processSkills.standards).toHaveLength(17);
    expect(new Set(processSkills.standards.map((s) => s.code)).size).toBe(17);
    expect(processSkills.source.page).toBe(29);
  });
  it("keeps timeline dates increasing and source answers valid", () => {
    expect(timelineEvents.map((e) => e.date)).toEqual([1701, 1825, 1835, 1837]);
    sourceCards.forEach((s) => {
      expect([0, 1]).toContain(s.answer);
      expect(s.why.length).toBeGreaterThan(10);
    });
    expect(
      environmentEvidence.rows.every(
        (row) => row.length === environmentEvidence.columns.length,
      ),
    ).toBe(true);
  });
  it("rejects declaring an unfinished standard ready", () => {
    expect(
      standardSchema.safeParse({ ...standards[10], status: "ready" }).success,
    ).toBe(false);
  });
});
