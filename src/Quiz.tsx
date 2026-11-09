import { useState, useRef, useEffect } from "react";
import type { Question, Standard } from "./data/schema";
import { grade, type Attempt } from "./progress";
type Props = {
  standard: Standard;
  questions: Question[];
  mode: "practice" | "assessment";
  round: number;
  onSave: (a: Attempt) => void;
  onClose: () => void;
};
export default function Quiz({
  standard,
  questions,
  mode,
  round,
  onSave,
  onClose,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const q = questions[index];
  useEffect(() => {
    title.current?.focus();
  }, [index, done]);
  function finish() {
    onSave({ standard: standard.code, mode, round, answers, at: Date.now() });
    setDone(true);
  }
  const result = grade(questions, answers);
  return (
    <section className="quiz panel">
      <span className="eyebrow">
        {mode === "assessment"
          ? `ASSESSMENT • ROUND ${round + 1}`
          : "PRACTICE • TAKE YOUR TIME"}
      </span>
      {done ? (
        <>
          <h2 ref={title} tabIndex={-1}>
            {result.score >= 0.8
              ? "Great exploring!"
              : "Every try helps you grow."}
          </h2>
          <p className="score">
            {result.correct} / {result.total}
          </p>
          <p>
            {mode === "assessment"
              ? "Mastery needs at least 4 out of 5 in both distinct rounds."
              : "Practice builds your skills. Assessment rounds count toward mastery."}
          </p>
          {result.missed.length > 0 && (
            <>
              <h3>Let’s review these clues</h3>
              {result.missed.map((item) => (
                <div className="feedback" key={item.id}>
                  <strong>{item.prompt}</strong>
                  <p>
                    Answer: {item.options[item.answer]}. {item.explanation}
                  </p>
                </div>
              ))}
            </>
          )}
          <button className="primary" onClick={onClose}>
            Back to lesson
          </button>
        </>
      ) : (
        <>
          <div className="row between">
            <p>
              Question {index + 1} of {questions.length}
            </p>
            <button className="text-button" onClick={onClose}>
              Leave activity
            </button>
          </div>
          <progress
            value={index}
            max={questions.length}
            aria-label="Questions completed"
          />
          <h2 ref={title} tabIndex={-1}>
            {q.prompt}
          </h2>
          <fieldset>
            <legend className="sr-only">Choose your answer</legend>
            {q.options.map((option, n) => (
              <label
                key={option}
                className={`option ${answers[q.id] === n ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name={q.id}
                  checked={answers[q.id] === n}
                  disabled={checked}
                  onChange={() => setAnswers({ ...answers, [q.id]: n })}
                />
                <span>{option}</span>
              </label>
            ))}
          </fieldset>
          {checked && (
            <div className="feedback" role="status">
              <strong>
                {answers[q.id] === q.answer
                  ? "You found it!"
                  : "A clue for next time"}
              </strong>
              <p>
                {q.explanation} Correct answer: {q.options[q.answer]}.
              </p>
            </div>
          )}
          <div className="row">
            {mode === "practice" && !checked ? (
              <button
                className="primary"
                disabled={answers[q.id] === undefined}
                onClick={() => setChecked(true)}
              >
                Check answer
              </button>
            ) : (
              <button
                className="primary"
                disabled={answers[q.id] === undefined}
                onClick={() => {
                  if (index === questions.length - 1) finish();
                  else {
                    setIndex(index + 1);
                    setChecked(false);
                  }
                }}
              >
                {index === questions.length - 1
                  ? "See my results"
                  : "Next question →"}
              </button>
            )}
          </div>
          {mode === "assessment" && (
            <p className="small">
              You’ll get explanations when you finish the round.
            </p>
          )}
        </>
      )}
    </section>
  );
}
