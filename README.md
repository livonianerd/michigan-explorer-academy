# Michigan Explorer Academy

A free, child-friendly Michigan Grade 3 Social Studies app built with React, TypeScript, Vite, Tailwind CSS, Zod, Vitest, and Playwright. No accounts, advertisements, analytics, or student personal information. This is an **unofficial project**, not affiliated with or endorsed by the Michigan Department of Education or any tribal nation.

## Run locally

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run preview` serves a production build. Browser tests cover desktop and phone layouts, navigation, standards filtering, practice feedback, targeted review, persistent mastery, timeline ordering, source classification, and absence of third-party requests. Unit tests cover grading, repeated rounds, threshold boundaries, incomplete banks, schema contracts, and storage failures.

## Release scope

- Dashboard, five module trails, searchable standards explorer, and per-standard progress.
- All **42 Grade 3 content expectations**: History 10, Geography 11, Civics and Government 8, Economics 7, and Public Discourse/Decision Making/Civic Participation 6.
- All 10 History expectations have original explanations, examples, objectives, five practice questions, and two distinct five-question assessment banks. Practice deliberately rehearses the first assessment bank; the second assessment bank has different questions. There are 100 distinct History question prompts (150 question placements including practice).
- Interactive keyboard-operated timelines and primary/secondary-source classification.
- Remaining modules contain verified official descriptions and **explicitly undeveloped** lessons, activities, and assessments. They cannot earn mastery.
- The 17 shared **Grades 3–5 process and skills standards**, official PDF page 29, are separately preserved in `src/data/process-skills.json` and shown in the standards explorer. Their dedicated instructional content is not developed. They are not assigned invented Grade 3 codes or included in the 42 content-expectation count.

## Official source and verification

[Michigan Department of Education, Michigan K–12 Social Studies Standards, June 2019](https://www.michigan.gov/mde/-/media/Project/Websites/mde/Academic-Standards/Social_Studies_Standards.pdf).

The linked official PDF was inspected through its extracted page text on November 8, 2026. Grade Three begins on **printed/PDF page 30**. History is page 30; Geography pages 31–32; Civics pages 32–33; Economics pages 33–34; Public Discourse pages 34–35. PDF page numbers match the document's printed numbers. Line wrapping and extraction artifacts inside words are normalized; official expectation wording and capitalization are retained. Codes use a compact ASCII hyphen (`3-H3.0.1`) instead of the PDF's spaced dash (`3 – H3.0.1`).

`src/data/standards.json` separates `officialDescription`, optional `officialExamples`, source references, and original lesson paragraphs. Examples following expectations in the official PDF are illustrative rather than additional expectations. Selected History examples are included; the linked source contains the full set of illustrative examples and strand/inquiry introductions. No Grade 3 content expectation is omitted. Official wording is presented in the explorer and an expandable source panel; lessons are explicitly labeled instructional paraphrases.

History teaching references also include the [Sault Tribe's Seven Grandfathers](https://www.saulttribe.com/history-a-culture/our-culture/100-seven-grandfathers), [Michigan History Center / Archives of Michigan's Steps to Statehood](https://michiganology.org/stories/steps-to-statehood-for-michigan/), [Michigan's state overview](https://www.michigan.gov/som/about-michigan), and [Detroit Historical Society's founding account](https://www.detroithistorical.org/learn/online-research/encyclopedia-of-detroit/founding-detroit). Lessons link their references. Fabricated diaries and comparison data are plainly labeled teaching models; they must never be cited as real archival records.

Verification limitation: source expectation text has been checked against the official PDF; the project has not received MDE approval, classroom efficacy testing, or review by tribal education departments. Generic source exercises teach evidence skills; they are not a digitized primary-source archive. Before adding community-specific stories, consult that community's publicly shared educational resources and permissions. Indigenous Peoples are presented as living communities and contemporary nations, not solely as people of the past.

## Content architecture and contributions

- `src/data/schema.ts`: extensible typed/runtime-validated standard, lesson, question, activity metadata, and mastery schemas.
- `src/data/standards.json`: version-controlled official content and original History instruction.
- `src/data/activities.ts`: version-controlled timeline events and source cards with answer explanations.
- `src/data/process-skills.json`: shared-band reference standards, separately scoped.
- `src/progress.ts`: grading, mastery, missed-concept selection, and anonymous storage.

To contribute:

1. Read the official expectation in context. Keep its exact wording in `officialDescription`; include edition, page, URL, and verification status. Put simplified language only in lessons/objectives.
2. Use original age-appropriate explanations and sourced examples. Attribute specific cultural teachings to the community that shared them; do not invent traditional stories, generalize all Indigenous nations, or reproduce restricted/sacred knowledge.
3. Add objectives, at least one lesson with reference links, activity metadata, five varied practice questions, and two **nonoverlapping** banks of at least five assessment questions with unique IDs. Each question needs an answer index, concept, and explanatory feedback. Add more than two choices when pedagogically useful.
4. Match interactive activity types to existing components or implement a keyboard-accessible component with structured data. Mark undeveloped content `planned` until it is complete.
5. Run `npm test`, `npm run build`, and `npm run test:e2e`. Check mobile layout, focus, contrast, and reduced motion. Have a teacher review alignment and reading level before release.

For another grade or subject, create a separate data collection using the existing `grade`, `subject`, `module`, `source`, and content fields. Extend the module enum and UI registry for new disciplines, use globally unique question/standard IDs, and version storage when its shape changes. Grade 3 is the only configured grade in this release; this is an extensible schema, not an already-built multi-grade product.

## Mastery and device storage

Assessment rounds are scored separately. A student needs **at least 80% (4/5) on each of two different rounds**. Replaying a single round cannot satisfy both requirements. Practice does not grant mastery. A later unsuccessful attempt does not remove an earned pass. Answers and explanations are shown after an assessment round; practice has immediate feedback. Missed-question review uses each question's latest submitted answer and drops it after a successful review.

Progress uses the versioned localStorage key `michigan-explorer-progress-v1`, containing only standard IDs, mode, round, numeric answer selections, and attempt times. Scores are derived from those selections. No student names, birthdates, contacts, or analytics identifiers exist. Progress is specific to the browser and device; clearing site data removes it. Reset is available in My progress and requires confirmation. Storage errors do not stop learning; a warning appears if saving fails. Completed activities are saved; an unfinished round is not saved.

The application performs no external fetches at runtime. Sources open only on deliberate navigation. Fonts and the SVG landscape are local. Optional browser text-to-speech depends on installed/browser voices; some operating systems may use network speech services, which the app explains before use in Privacy & project information. Hosting providers may maintain their own access logs.

## Accessibility

Semantic headings, landmarks, native controls and radio groups, skip link, visible focus, button-based sorting, screen-reader feedback, route heading focus, responsive layouts, reduced-motion CSS, and optional read aloud. Color is accompanied by text. This is not a claim of an independent WCAG audit. Manual screen-reader and classroom testing remain welcome.

## GitHub Pages deployment

`.github/workflows/pages.yml` runs unit tests, type checking/build, and Playwright before deployment. Pull requests verify without publishing. Pushes to `main` deploy automatically; workflow dispatch is also supported.

1. Put this source in a GitHub repository and push it to `main`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. The workflow deploys the `dist` artifact and reports the Pages URL.

Vite uses a relative base locally. CI supplies `BASE_PATH=/<repository-name>/`, and the hash-based routes survive reloads under repository subpaths without server rewrite rules. For an organization/user root Pages site or custom domain, change the workflow build environment to `BASE_PATH=/`. For a manual subpath build:

```sh
BASE_PATH=/michigan-explorer-academy/ npm run build
```

Deployment requires a real writable Git repository, a GitHub remote, and GitHub authentication. No live deployment is implied by the presence of this workflow.
