# Verification record

## GitHub Actions repair — November 9, 2026 (UTC)

Failed run: https://github.com/livonianerd/michigan-explorer-academy/actions/runs/42556988481

The Verify job stopped at `npm ci`, before build or tests. Its lockfile used the malformed scoped-package URL `https://registry.npmjs.org/@alloc/quick-lru/-/@alloc/quick-lru-5.2.0.tgz`, which returns HTTP 404. The npm registry's package metadata confirms the canonical tarball URL is `https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz`; its existing integrity hash was already correct. The lockfile URL is corrected without changing dependency versions. A regression test checks every locked npm tarball path, including scoped package basenames.

Local verification after the correction:

- Registry request to the original URL reproduced HTTP 404; installation from the corrected lockfile succeeded with `npm install` using a fresh registry cache.
- `npm test`: **23 tests passed**, including lockfile regression, grading/mastery, schemas, storage resilience, activity data, and hash routing.
- `npm run build`: TypeScript and production Vite build passed with `/michigan-explorer-academy/` as the default base. Built JavaScript and CSS URLs use that repository subpath.
- `npx playwright test`: **10 tests passed** across desktop Chromium and a phone viewport. Tests cover standards navigation, both assessment rounds, persisted mastery, wrong-answer feedback, targeted review, keyboard timeline controls, source classification, responsive layout, no third-party requests, and production asset paths.
- Playwright now serves the actual `dist` build through a fresh Vite preview process on dedicated port 4175. It does not reuse an unrelated development server. No tests were disabled or skipped.
- A sandboxed local `npm ci` attempt could not complete esbuild's binary validation because child-process execution returned `EPERM`; the subsequent permitted `npm install` succeeded. The GitHub workflow retains ordinary `npm ci` with install scripts enabled, so CI must validate the clean install independently.

The first repair run (`42557593269`) independently passed clean `npm ci`, all unit/browser tests, and the production build in GitHub Actions. It then exposed a separate deployment prerequisite: Pages was not enabled, so `deploy-pages` returned HTTP 404. The repository Pages site has now been created through the authenticated GitHub API with `build_type: workflow`, HTTPS enforced, and the target URL `https://livonianerd.github.io/michigan-explorer-academy/`. The deployment job now runs `actions/configure-pages@v5` before publishing to check Pages configuration explicitly.

The Pages workflow tests the production build before uploading `dist`, and deployment requires Verify to pass. Its deployment job has `contents: read`, `pages: write`, and `id-token: write` and runs only for `main` outside pull requests.

Manual screen-reader testing, classroom/teacher review, and tribal education review are not claimed. Initial implementation-era sandbox restrictions recorded previously are superseded by the successful browser verification above.
