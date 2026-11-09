# Verification record

Local verification performed November 8, 2026:

- `npm test`: 22 tests passed across grading/mastery, content schemas, shared reference data, activity data, storage resilience, and hash routing.
- `BASE_PATH=/michigan-explorer-academy/ npm run build`: TypeScript and production Vite build passed. Built asset URLs use the repository subpath.
- Playwright specs are supplied for desktop Chromium and a phone viewport. **Browser tests have not passed locally**: the execution sandbox denies Playwright's localhost HTTP check with `connect EPERM`. A direct screenshot attempt also failed when Chromium was denied the `shutdown` operation. No screenshot or independent visual/browser accessibility verification is claimed.
- GitHub Pages workflow is included but **not deployed or run remotely**. The supplied `.git` directory is empty and read-only, and `gh auth status` fails because the installed snap lacks required permissions. No remote repository or live URL is available from this workspace.
- Automatic approval review rejected an attempt to install dependencies outside the sandbox because sandbox escalation is disabled. Dependencies were subsequently installed from local caches. The project lockfile uses canonical npm registry URLs and integrity values, not local filesystem/package-server URLs.

The workflow requires unit tests, a subpath production build, and browser tests to pass before publishing. See README for GitHub repository and Pages setup. Manual screen-reader testing, classroom/teacher review, and tribal education review are not claimed.
