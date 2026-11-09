import { z } from "zod";
export const questionSchema = z
  .object({
    id: z.string(),
    kind: z.enum(["choice", "true-false", "sequence", "source"]),
    prompt: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    answer: z.number().int().nonnegative(),
    explanation: z.string().min(1),
    concept: z.string().min(1),
  })
  .refine((q) => q.answer < q.options.length, "Answer must index an option");
export const standardSchema = z
  .object({
    code: z.string(),
    grade: z.number(),
    subject: z.string(),
    module: z.enum([
      "History",
      "Geography",
      "Civics and Government",
      "Economics",
      "Public Discourse",
    ]),
    officialDescription: z.string().min(10),
    officialExamples: z.array(z.string()),
    source: z.object({
      url: z.string().url(),
      page: z.number().int().positive(),
      edition: z.string(),
      verified: z.boolean(),
    }),
    status: z.enum(["ready", "planned"]),
    title: z.string(),
    objectives: z.array(z.string()),
    lessons: z.array(
      z.object({
        title: z.string(),
        paragraphs: z.array(z.string()),
        example: z.string(),
        references: z.array(z.string().url()),
      }),
    ),
    activities: z.array(
      z.object({
        type: z.enum(["timeline", "sources", "investigate"]),
        title: z.string(),
        instructions: z.string(),
      }),
    ),
    practice: z.array(questionSchema),
    assessments: z.array(z.array(questionSchema)),
    mastery: z.object({
      threshold: z.number().min(0).max(1),
      rounds: z.number().int().min(2),
      questionsPerRound: z.number().int().min(5),
    }),
  })
  .superRefine((s, ctx) => {
    if (s.status !== "ready") return;
    const questions = s.assessments.flat();
    if (
      !s.objectives.length ||
      !s.lessons.length ||
      !s.activities.length ||
      s.practice.length < 5 ||
      s.assessments.length < s.mastery.rounds ||
      s.assessments.some((b) => b.length < s.mastery.questionsPerRound) ||
      new Set(questions.map((q) => q.id)).size !== questions.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Ready standards need objectives, lessons, activities, practice, and complete distinct assessment banks.",
      });
    }
  });
export type Question = z.infer<typeof questionSchema>;
export type Standard = z.infer<typeof standardSchema>;
