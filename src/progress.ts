import { z } from "zod";
import type { Question, Standard } from "./data/schema";
const attemptSchema = z.object({
  standard: z.string(),
  mode: z.enum(["practice", "assessment"]),
  round: z.number().int().min(0).max(1),
  answers: z.record(z.number().int().nonnegative()),
  at: z.number(),
});
export type Attempt = z.infer<typeof attemptSchema>;
export type Progress = { version: 1; attempts: Attempt[] };
export const KEY = "michigan-explorer-progress-v1";
export const emptyProgress = (): Progress => ({ version: 1, attempts: [] });
export function loadProgress(): Progress {
  try {
    const value = localStorage.getItem(KEY);
    return value
      ? z
          .object({ version: z.literal(1), attempts: z.array(attemptSchema) })
          .parse(JSON.parse(value))
      : emptyProgress();
  } catch {
    return emptyProgress();
  }
}
export function saveProgress(progress: Progress): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
export function grade(questions: Question[], answers: Record<string, number>) {
  const correct = questions.filter((q) => answers[q.id] === q.answer).length;
  return {
    correct,
    total: questions.length,
    score: questions.length ? correct / questions.length : 0,
    missed: questions.filter((q) => answers[q.id] !== q.answer),
  };
}
export function passedRounds(s: Standard, progress: Progress) {
  return s.assessments.map(
    (questions, round) =>
      questions.length >= s.mastery.questionsPerRound &&
      progress.attempts.some(
        (a) =>
          a.standard === s.code &&
          a.mode === "assessment" &&
          a.round === round &&
          grade(questions, a.answers).score >= s.mastery.threshold,
      ),
  );
}
export function isMastered(s: Standard, p: Progress) {
  const banks = s.assessments;
  const unique = new Set(banks.flat().map((q) => q.id));
  return (
    banks.length >= s.mastery.rounds &&
    unique.size === banks.flat().length &&
    passedRounds(s, p).filter(Boolean).length >= s.mastery.rounds
  );
}
export function missedQuestions(s: Standard, p: Progress): Question[] {
  const attempts = p.attempts.filter((a) => a.standard === s.code);
  const latest = new Map<string, number>();
  attempts.forEach((a) =>
    Object.entries(a.answers).forEach(([id, answer]) => latest.set(id, answer)),
  );
  return [
    ...new Map(
      [...s.practice, ...s.assessments.flat()].map((q) => [q.id, q]),
    ).values(),
  ].filter((q) => latest.has(q.id) && latest.get(q.id) !== q.answer);
}
