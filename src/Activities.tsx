import { useState } from "react";
import { ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import {
  timelineEvents as events,
  sourceCards as sources,
  environmentEvidence,
  timelineActivity,
  sourceActivity,
} from "./data/activities";
export function Timeline() {
  const [order, setOrder] = useState(timelineActivity.initialOrder);
  const [checked, setChecked] = useState(false);
  function move(index: number, by: number) {
    const next = [...order];
    [next[index], next[index + by]] = [next[index + by], next[index]];
    setOrder(next);
    setChecked(false);
  }
  return (
    <section className="activity">
      <span className="eyebrow">HANDS-ON HISTORY</span>
      <h3>{timelineActivity.title}</h3>
      <p>{timelineActivity.instructions}</p>
      <p className="small">{timelineActivity.context}</p>
      <ol className="timeline">
        {order.map((id, i) => (
          <li key={id}>
            <strong>{events[id].date}</strong>
            <span>{events[id].text}</span>
            <button
              aria-label={`Move ${events[id].date} earlier`}
              disabled={i === 0}
              onClick={() => move(i, -1)}
            >
              <ArrowUp size={17} />
            </button>
            <button
              aria-label={`Move ${events[id].date} later`}
              disabled={i === order.length - 1}
              onClick={() => move(i, 1)}
            >
              <ArrowDown size={17} />
            </button>
          </li>
        ))}
      </ol>
      <button className="primary" onClick={() => setChecked(true)}>
        Check my timeline
      </button>
      <p role="status">
        {checked &&
          (order.every((id, i) => id === i)
            ? timelineActivity.success
            : timelineActivity.retry)}
      </p>
    </section>
  );
}
export function SourceSort() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  return (
    <section className="activity">
      <span className="eyebrow">EVIDENCE LAB</span>
      <h3>{sourceActivity.title}</h3>
      <p>{sourceActivity.instructions}</p>
      {sources.map((s, i) => (
        <fieldset className="source-card" key={s.text}>
          <legend>{s.text}</legend>
          <div className="row">
            {sourceActivity.categories.map((label, n) => (
              <button
                key={label}
                aria-pressed={answers[i] === n}
                onClick={() => setAnswers({ ...answers, [i]: n })}
              >
                {label}
              </button>
            ))}
          </div>
          {answers[i] !== undefined && (
            <p role="status">
              {answers[i] === s.answer ? "That’s right!" : "Try again."} {s.why}
            </p>
          )}
        </fieldset>
      ))}
      <button className="text-button" onClick={() => setAnswers({})}>
        <RotateCcw size={16} />
        Try again
      </button>
    </section>
  );
}
export function EnvironmentEvidence() {
  return (
    <section className="activity">
      <span className="eyebrow">LOOK CLOSELY</span>
      <h3>{environmentEvidence.title}</h3>
      <div className="table-scroll">
        <table>
          <caption>{environmentEvidence.caption}</caption>
          <thead>
            <tr>
              {environmentEvidence.columns.map((c) => (
                <th scope="col" key={c}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {environmentEvidence.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th scope="row" key={i}>
                      {cell}
                    </th>
                  ) : (
                    <td key={i}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{environmentEvidence.question}</p>
      <details className="official">
        <summary>Compare your reasoning</summary>
        <p>{environmentEvidence.explanation}</p>
      </details>
    </section>
  );
}
