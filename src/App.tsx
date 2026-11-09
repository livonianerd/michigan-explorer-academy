import { useEffect, useRef, useState } from "react";
import {
  Compass,
  House,
  BookOpen,
  Map as MapIcon,
  Landmark,
  Sprout,
  MessagesSquare,
  ArrowRight,
  Check,
  ChevronRight,
  ShieldCheck,
  Volume2,
  Trophy,
  Flag,
  Mountain,
  Leaf,
  Search,
  Menu,
  X,
  RotateCcw,
} from "lucide-react";
import { standards, history, modules } from "./data";
import processSkills from "./data/process-skills.json";
import type { Standard } from "./data/schema";
import {
  loadProgress,
  saveProgress,
  emptyProgress,
  grade,
  passedRounds,
  isMastered,
  missedQuestions,
  type Attempt,
} from "./progress";
import Landscape from "./Art";
import { Timeline, SourceSort, EnvironmentEvidence } from "./Activities";
import Quiz from "./Quiz";
import { parseRoute } from "./navigation";
const icons = [BookOpen, MapIcon, Landmark, Sprout, MessagesSquare];
const descriptions = [
  "Discover the people, stories, and moments that shaped our state.",
  "Explore our peninsulas, waterways, and the places we call home.",
  "Learn how we work together and how our government works.",
  "Follow the resources, choices, and trade that connect us.",
  "Find your voice and make a difference in your community.",
];
function route() {
  return parseRoute(location.hash);
}
function go(view: string, code?: string) {
  location.hash = code ? `${view}/${code}` : view;
}
function App() {
  const [current, setCurrent] = useState(route);
  const [progress, setProgress] = useState(loadProgress);
  const [storageOK, setStorageOK] = useState(true);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All modules");
  const [quiz, setQuiz] = useState<{
    mode: "practice" | "assessment";
    round: number;
    review?: boolean;
  } | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    function change() {
      document.title = "Michigan Explorer Academy";
      setCurrent(route());
      setQuiz(null);
      setMenu(false);
      setSpeaking(false);
      window.speechSynthesis?.cancel();
      window.scrollTo(0, 0);
      requestAnimationFrame(() => heading.current?.focus());
    }
    addEventListener("hashchange", change);
    return () => {
      removeEventListener("hashchange", change);
      window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenu(false);
        document.querySelector<HTMLButtonElement>(".mobile-menu")?.focus();
      }
    }
    addEventListener("keydown", escape);
    return () => removeEventListener("keydown", escape);
  }, [menu]);
  const mastered = history.filter((s) => isMastered(s, progress)).length;
  const started = history.filter((s) =>
    progress.attempts.some((a) => a.standard === s.code),
  ).length;
  const next = history.find((s) => !isMastered(s, progress)) || history[0];
  const selected = standards.find((s) => s.code === current.code);
  const module = modules.find((m) => m === current.view);
  function save(a: Attempt) {
    const p = { ...progress, attempts: [...progress.attempts, a] };
    setProgress(p);
    setStorageOK(saveProgress(p));
  }
  function speak(s: Standard) {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(
      `${s.title}. ${s.lessons.flatMap((l) => l.paragraphs).join(" ")}`,
    );
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }
  function standardCard(s: Standard) {
    const ready = s.status === "ready";
    const passed = passedRounds(s, progress).filter(Boolean).length;
    const attempts = progress.attempts.filter((a) => a.standard === s.code);
    const last = attempts.at(-1);
    const lastQuestions = last
      ? [
          ...new Map(
            [...s.practice, ...s.assessments.flat()].map((q) => [q.id, q]),
          ).values(),
        ].filter((q) => last.answers[q.id] !== undefined)
      : [];
    const latest = last ? grade(lastQuestions, last.answers) : null;
    return (
      <article key={s.code} className="standard-card">
        <div className="row between">
          <span className="code">{s.code}</span>
          <span className={`pill ${ready ? "green" : ""}`}>
            {ready
              ? isMastered(s, progress)
                ? "Mastered ✓"
                : passed
                  ? `${passed}/2 rounds passed`
                  : "Ready to explore"
              : "Content in development"}
          </span>
        </div>
        <h3>{ready ? s.title : s.module}</h3>
        <p className="official-label">OFFICIAL EXPECTATION</p>
        <p>{s.officialDescription}</p>
        {ready && (
          <div className="skill-progress">
            <progress
              aria-label={`${s.code} assessment rounds passed`}
              value={passed}
              max={2}
            />
            <span>
              {passed}/2 assessment rounds passed
              {latest
                ? ` · Last activity: ${latest.correct}/${latest.total} · ${attempts.length} ${attempts.length === 1 ? "attempt" : "attempts"}`
                : ""}
            </span>
          </div>
        )}
        <button className="text-button" onClick={() => go("standard", s.code)}>
          {ready ? "Explore lesson" : "View standard"}
          <ArrowRight size={17} />
        </button>
      </article>
    );
  }
  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <aside
        id="academy-navigation"
        className={`sidebar ${menu ? "open" : ""}`}
      >
        <a href="#home" className="brand">
          <span className="brand-icon">
            <Compass size={29} />
          </span>
          <span>
            Michigan Explorer<small>ACADEMY</small>
          </span>
        </a>
        <div className="grade-tag">
          <span className="dot" />
          GRADE 3 SOCIAL STUDIES
        </div>
        <nav aria-label="Main navigation">
          <p className="nav-label">YOUR ADVENTURE</p>
          <a className={current.view === "home" ? "active" : ""} href="#home">
            <House size={20} />
            Explorer dashboard
          </a>
          <a
            className={current.view === "standards" ? "active" : ""}
            href="#standards"
          >
            <Search size={20} />
            Standards explorer
          </a>
          <p className="nav-label module-label">LEARNING TRAILS</p>
          {modules.map((m, i) => {
            const Icon = icons[i];
            return (
              <a
                key={m}
                href={`#${m}`}
                className={
                  current.view === m || selected?.module === m ? "active" : ""
                }
              >
                <Icon size={20} />
                <span>
                  {m === "Civics and Government"
                    ? "Civics & government"
                    : m === "Public Discourse"
                      ? "Your civic voice"
                      : m}
                </span>
                {i === 0 && <span className="tiny-dot" />}
              </a>
            );
          })}
          <a
            className={
              current.view === "progress"
                ? "active progress-link"
                : "progress-link"
            }
            href="#progress"
          >
            <Flag size={20} />
            My progress
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="little-tree">
            <Sprout size={32} />
          </div>
          <strong>Little steps. Big discoveries.</strong>
          <p>There’s something new around every corner.</p>
          <a href="#about">
            <ShieldCheck size={15} />
            Free, safe & made for learning
          </a>
        </div>
      </aside>
      <div className="app-shell">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            aria-controls="academy-navigation"
            onClick={() => {
              setMenu(!menu);
              if (!menu)
                requestAnimationFrame(() =>
                  document
                    .querySelector<HTMLAnchorElement>(".sidebar nav a")
                    ?.focus(),
                );
            }}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <div className="breadcrumb">
            Your adventure <ChevronRight size={14} />
            <span>
              {selected
                ? "History lesson"
                : current.view === "home"
                  ? "Explorer dashboard"
                  : current.view === "standard"
                    ? "Standard"
                    : current.view}
            </span>
          </div>
          <div className="explorer-tag">
            <span>
              <Compass size={17} />
            </span>
            Curious minds welcome
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {!storageOK && (
            <p className="notice" role="alert">
              Your browser could not save progress. You can keep learning, but
              this visit’s progress may be lost when you leave.
            </p>
          )}
          {current.view === "home" && (
            <>
              <div className="welcome">
                <div>
                  <span className="eyebrow">BIG DISCOVERIES START HERE</span>
                  <h1 ref={heading} tabIndex={-1}>
                    Hello, Michigan explorer! <span className="wave">☀</span>
                  </h1>
                  <p>
                    Your next adventure is right in your own state. Let’s
                    discover it together.
                  </p>
                </div>
                <span className="season">
                  <Leaf size={16} />
                  Made for curious minds
                </span>
              </div>
              <section className="hero">
                <div className="hero-copy">
                  <span className="hero-tag">
                    <Compass size={15} />
                    YOUR GREAT LAKES ADVENTURE
                  </span>
                  <h2>
                    A little curiosity.
                    <br />A whole state to explore.
                  </h2>
                  <p>
                    Travel through time, follow the waterways, and meet the
                    people who make Michigan, Michigan.
                  </p>
                  <button className="primary" onClick={() => go("History")}>
                    Let’s explore History
                    <ArrowRight size={18} />
                  </button>
                  <span className="hero-note">
                    Your first learning trail is ready!
                  </span>
                </div>
                <Landscape />
                <span className="postmark">
                  THE GREAT
                  <br />
                  <strong>LAKES STATE</strong>
                  <span>EST. 1837</span>
                </span>
              </section>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-icon sage">
                    <Compass />
                  </span>
                  <div>
                    <strong>
                      {started} <small>/ 10</small>
                    </strong>
                    <p>History skills explored</p>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon gold">
                    <Trophy />
                  </span>
                  <div>
                    <strong>
                      {mastered} <small>earned</small>
                    </strong>
                    <p>Mastered History skills</p>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon blue">
                    <Flag />
                  </span>
                  <div>
                    <strong>At your pace</strong>
                    <p>No timers. Just discovery.</p>
                  </div>
                </div>
              </div>
              <div className="section-heading">
                <div>
                  <h2>Choose your learning trail</h2>
                  <p>Five ways to get to know the Mitten State.</p>
                </div>
                <a href="#standards">
                  View all standards
                  <ArrowRight size={16} />
                </a>
              </div>
              <div className="trail-grid">
                {modules.map((m, i) => {
                  const Icon = icons[i];
                  return (
                    <article key={m} className={`trail trail-${i}`}>
                      <div className="row between">
                        <span className="trail-icon">
                          <Icon size={26} />
                        </span>
                        <span className={`pill ${i === 0 ? "green" : ""}`}>
                          {i === 0 ? "Ready to explore" : "Coming later"}
                        </span>
                      </div>
                      <h3>
                        {m === "Public Discourse"
                          ? "Your civic voice"
                          : m === "Civics and Government"
                            ? "Civics & government"
                            : m}
                      </h3>
                      <p>{descriptions[i]}</p>
                      <div className="trail-foot">
                        <span>
                          {standards.filter((s) => s.module === m).length}{" "}
                          standards{i === 0 ? " · 10 adventures" : ""}
                        </span>
                        <a href={`#${m}`} aria-label={`Explore ${m}`}>
                          <ArrowRight size={20} />
                        </a>
                      </div>
                    </article>
                  );
                })}
                <article className="wonder-card">
                  <Mountain size={30} />
                  <span className="eyebrow">EXPLORER MINDSET</span>
                  <h3>
                    Every great discovery
                    <br />
                    starts with a question.
                  </h3>
                  <p>What will you wonder about today?</p>
                  <div className="wonder-line" />
                </article>
              </div>
              <section className="continue panel">
                <span className="stat-icon sage">
                  <BookOpen />
                </span>
                <div>
                  <span className="eyebrow">YOUR NEXT SMALL STEP</span>
                  <h3>{next.title}</h3>
                  <p>History · {next.code} · Learn, practice, and discover</p>
                </div>
                <button
                  className="secondary"
                  onClick={() => go("standard", next.code)}
                >
                  {started ? "Keep exploring" : "Start here"}
                  <ArrowRight size={17} />
                </button>
              </section>
            </>
          )}
          {module && (
            <>
              <span className="eyebrow">YOUR LEARNING TRAILS</span>
              <h1 ref={heading} tabIndex={-1}>
                {module === "Public Discourse" ? "Your civic voice" : module}
              </h1>
              <p className="intro">{descriptions[modules.indexOf(module)]}</p>
              {module === "History" ? (
                <div className="module-banner">
                  <BookOpen />
                  <div>
                    <strong>10 adventures through early Michigan</strong>
                    <p>
                      Learn a little. Practice your skills. Pass two different
                      assessment rounds with 80% or more to master each
                      expectation.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="notice">
                  Lessons, activities, and assessments are not yet developed for
                  this trail. Every official Grade 3 expectation is listed below
                  so you can see what’s ahead.
                </p>
              )}
              <div className="standards-grid">
                {standards.filter((s) => s.module === module).map(standardCard)}
              </div>
            </>
          )}
          {current.view === "standards" && (
            <>
              <span className="eyebrow">THE MAP BEHIND YOUR ADVENTURE</span>
              <h1 ref={heading} tabIndex={-1}>
                Standards explorer
              </h1>
              <p className="intro">
                All 42 Grade 3 content expectations. Official Michigan wording,
                with a trail for every skill.
              </p>
              <div className="filters">
                <label>
                  Find a standard
                  <div className="search-box">
                    <Search size={18} />
                    <input
                      placeholder="Try a code, topic, or keyword"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </label>
                <label>
                  Learning trail
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    {["All modules", ...modules].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="small">
                Source: Michigan Department of Education, June 2019, pages
                30–35. Shared Grades 3–5 process skills are documented in the
                README.
              </p>
              <div className="standards-grid">
                {standards
                  .filter(
                    (s) =>
                      (filter === "All modules" || s.module === filter) &&
                      `${s.code} ${s.title} ${s.officialDescription}`
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                  )
                  .map(standardCard)}
              </div>
              <details className="official">
                <summary>
                  Shared Grades 3–5 process and skills standards (17)
                </summary>
                <p>
                  {processSkills.scope}. {processSkills.status}.
                </p>
                {processSkills.standards.map((s) => (
                  <div className="process-skill" key={s.code}>
                    <strong>{s.code}</strong>
                    <p>{s.officialDescription}</p>
                  </div>
                ))}
                <a
                  href={`${processSkills.source.url}#page=29`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Official source · p. 29 (PDF, new tab)
                </a>
              </details>
              {!standards.some(
                (s) =>
                  (filter === "All modules" || s.module === filter) &&
                  `${s.code} ${s.title} ${s.officialDescription}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
              ) && (
                <p>No standards match. Try another word or learning trail.</p>
              )}
            </>
          )}
          {current.view === "standard" && selected && (
            <>
              <a className="back-link" href={`#${selected.module}`}>
                ← Back to {selected.module}
              </a>
              <div className="row between">
                <div>
                  <span className="eyebrow">
                    {selected.module.toUpperCase()} · {selected.code}
                  </span>
                  <h1 ref={heading} tabIndex={-1}>
                    {selected.status === "ready"
                      ? selected.title
                      : selected.code}
                  </h1>
                </div>
                {selected.status === "ready" && "speechSynthesis" in window && (
                  <button className="secondary" onClick={() => speak(selected)}>
                    <Volume2 size={18} />
                    {speaking ? "Stop reading" : "Read lesson aloud"}
                  </button>
                )}
              </div>
              <details className="official">
                <summary>Official expectation & source</summary>
                <p>{selected.officialDescription}</p>
                {selected.officialExamples.length > 0 && (
                  <p>
                    Examples may include but are not limited to:{" "}
                    {selected.officialExamples.join(" ")}
                  </p>
                )}
                <a
                  href={`${selected.source.url}#page=${selected.source.page}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Michigan Department of Education · {selected.source.edition} ·
                  p. {selected.source.page} (opens PDF in new tab)
                </a>
              </details>
              {selected.status === "planned" ? (
                <p className="notice">
                  Instructional content is not yet developed for this
                  expectation. The official description and source are verified.
                </p>
              ) : quiz ? (
                <Quiz
                  key={`${selected.code}-${quiz.mode}-${quiz.round}-${quiz.review}`}
                  standard={selected}
                  questions={
                    quiz.review
                      ? missedQuestions(selected, progress)
                      : quiz.mode === "practice"
                        ? selected.practice
                        : selected.assessments[quiz.round]
                  }
                  mode={quiz.mode}
                  round={quiz.round}
                  onSave={save}
                  onClose={() => {
                    setQuiz(null);
                    requestAnimationFrame(() => heading.current?.focus());
                  }}
                />
              ) : (
                <>
                  <div className="lesson-layout">
                    <article className="panel lesson">
                      <span className="eyebrow">
                        LET’S LEARN · INSTRUCTIONAL PARAPHRASE
                      </span>
                      <div className="learning-goals">
                        <strong>Your mission</strong>
                        <ul>
                          {selected.objectives.map((o) => (
                            <li key={o}>{o}</li>
                          ))}
                        </ul>
                      </div>
                      {selected.lessons.map((l) => (
                        <div key={l.title}>
                          <h2>{l.title}</h2>
                          {l.paragraphs.map((p) => (
                            <p key={p}>{p}</p>
                          ))}
                          <details>
                            <summary>Sources & further reading</summary>
                            <ul>
                              {l.references.map((r, i) => (
                                <li key={r}>
                                  <a href={r} target="_blank" rel="noreferrer">
                                    {new URL(r).hostname.replace("www.", "")} —
                                    source {i + 1} (new tab)
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      ))}
                    </article>
                    <aside className="panel lesson-checkpoint">
                      <span className="stat-icon gold">
                        <Flag />
                      </span>
                      <h3>Your trail checkpoint</h3>
                      <p>
                        Practice first, then try both rounds. Score at least 4
                        out of 5 in each.
                      </p>
                      <button
                        className="primary"
                        onClick={() => setQuiz({ mode: "practice", round: 0 })}
                      >
                        Practice this skill
                        <ArrowRight size={16} />
                      </button>
                      {selected.assessments.map((_, round) => (
                        <button
                          className="secondary"
                          key={round}
                          onClick={() => setQuiz({ mode: "assessment", round })}
                        >
                          {passedRounds(selected, progress)[round] ? (
                            <Check size={17} />
                          ) : (
                            <Flag size={17} />
                          )}
                          Assessment round {round + 1}
                        </button>
                      ))}
                      {missedQuestions(selected, progress).length > 0 && (
                        <button
                          className="text-button"
                          onClick={() =>
                            setQuiz({
                              mode: "practice",
                              round: 0,
                              review: true,
                            })
                          }
                        >
                          Review missed questions (
                          {missedQuestions(selected, progress).length})
                        </button>
                      )}
                      <p className="small">
                        {isMastered(selected, progress)
                          ? "Skill mastered! You passed both distinct rounds."
                          : "You can try again whenever you’re ready."}
                      </p>
                    </aside>
                  </div>
                  {selected.code === "3-H3.0.5" && <EnvironmentEvidence />}
                  {selected.activities.some((a) => a.type === "timeline") && (
                    <Timeline />
                  )}
                  {selected.activities.some((a) => a.type === "sources") && (
                    <SourceSort />
                  )}
                  {selected.activities
                    .filter((a) => a.type === "investigate")
                    .map((activity, i) => (
                      <section className="activity" key={i}>
                        <span className="eyebrow">YOUR TURN</span>
                        <h3>{activity.title}</h3>
                        <p>{activity.instructions}</p>
                        <p className="small">
                          Use “Practice this skill” to check your understanding
                          and get explanations.
                        </p>
                      </section>
                    ))}
                </>
              )}
            </>
          )}
          {current.view === "progress" && (
            <>
              <span className="eyebrow">LOOK HOW FAR YOU’VE COME</span>
              <h1 ref={heading} tabIndex={-1}>
                My explorer progress
              </h1>
              <p className="intro">
                {mastered} of 10 History skills mastered. Every attempt is a
                step forward.
              </p>
              <div className="panel">
                <h2>A skill takes more than one lucky guess</h2>
                <p>
                  Pass both distinct five-question rounds with at least 80% in
                  each. Practice attempts help you learn; they do not count as
                  assessment passes.
                </p>
                <p>
                  Progress stays in this browser on this device. Clearing
                  browser storage removes it. No account or student information
                  is needed.
                </p>
              </div>
              <div className="standards-grid">{history.map(standardCard)}</div>
              <details className="reset">
                <summary>Manage this device’s progress</summary>
                <p>Resetting removes all saved attempts from this browser.</p>
                <button
                  className="secondary"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Remove all learning progress on this device?",
                      )
                    ) {
                      const p = emptyProgress();
                      setProgress(p);
                      setStorageOK(saveProgress(p));
                    }
                  }}
                >
                  <RotateCcw size={16} />
                  Reset local progress
                </button>
              </details>
            </>
          )}
          {current.view === "about" && (
            <>
              <span className="eyebrow">FOR FAMILIES & EDUCATORS</span>
              <h1 ref={heading} tabIndex={-1}>
                A safe place to be curious
              </h1>
              <div className="panel prose">
                <h2>Free learning, without an account</h2>
                <p>
                  Michigan Explorer Academy does not ask for names, email
                  addresses, birthdates, or other personal information. There
                  are no ads, analytics scripts, chat, tracking identifiers, or
                  third-party sign-in.
                </p>
                <h2>Progress belongs to this device</h2>
                <p>
                  Only activity answers, scores derived from them, standard
                  codes, and attempt times are saved in your browser’s
                  localStorage. They are not sent to a server. Browser privacy
                  settings may prevent saving. Clear progress from My progress
                  or your browser’s settings.
                </p>
                <h2>Optional read aloud</h2>
                <p>
                  Read aloud uses your browser’s speech service. Voice
                  availability depends on your device; some browser or
                  operating-system voices may use an online speech service. Use
                  an installed local voice or leave read aloud off if you
                  prefer.
                </p>
                <h2>Unofficial educational project</h2>
                <p>
                  This project is not affiliated with or endorsed by the
                  Michigan Department of Education or any tribal nation.
                  Official expectations are quoted separately from original
                  instructional paraphrases. This first release develops
                  History; other trails list standards with content in
                  development.
                </p>
                <p>
                  External sources open only when you choose their links. Those
                  websites have their own privacy practices. Hosting providers
                  may keep ordinary request logs; this app does not add
                  analytics.
                </p>
                <a
                  href={standards[0].source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the official Michigan Social Studies Standards (PDF, new
                  tab)
                </a>
              </div>
            </>
          )}
          {![
            "home",
            "standards",
            "standard",
            "progress",
            "about",
            ...modules,
          ].includes(current.view) && (
            <>
              <h1 ref={heading} tabIndex={-1}>
                Let’s find your trail
              </h1>
              <a href="#home">Return to your dashboard</a>
            </>
          )}
          {current.view === "standard" && !selected && (
            <>
              <h1>Standard not found</h1>
              <a href="#standards">Browse all standards</a>
            </>
          )}
          <footer>
            <span>
              <Compass size={17} />
              Rooted in Michigan. Made for discovery.
            </span>
            <a href="#about">Privacy & project information</a>
            <p>
              Unofficial educational project · Not affiliated with the Michigan
              Department of Education.
              <br />
              Your progress is saved only in this browser on this device.
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
export default App;
