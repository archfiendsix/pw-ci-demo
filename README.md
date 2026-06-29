# pw-ci-demo

A tiny static website with **Playwright tests colocated in the repo** — the standard
"tests inside the frontend repo" layout. Purpose: a real repo you can push to GitHub
and use to exercise CI/CD triggers (PR, push, cron, manual) with live Playwright runs.

## Layout

```
pw-ci-demo/
├─ public/                 # the website (static HTML/CSS/JS)
│  ├─ index.html           #   home + quote widget (fetches /api/quote)
│  ├─ login.html           #   login form
│  ├─ dashboard.html       #   auth-gated page
│  └─ todos.html           #   localStorage CRUD
├─ server.js               # zero-dep static server + fake /api/quote
├─ tests/                  # Playwright specs (colocated)
│  ├─ auth.setup.ts        #   logs in once, saves storageState
│  ├─ home.spec.ts         #   navigation + structure (@smoke)
│  ├─ login.spec.ts        #   form success/failure paths
│  ├─ todos.spec.ts        #   CRUD + persistence
│  ├─ api-mock.spec.ts     #   network interception
│  └─ dashboard.spec.ts    #   reuses saved auth state
├─ playwright.config.ts    # webServer, CI retries, reporters, projects
└─ package.json
```

## Run locally

```bash
npm ci
npx playwright install --with-deps chromium
npm test            # full suite (Playwright boots server.js itself)
npm run test:smoke  # just @smoke tests
npm run report      # open last HTML report
```

## Real-life patterns demonstrated

- **webServer** — Playwright starts/stops the app; no manual server step in CI.
- **storageState auth** — log in once (`setup` project), reuse everywhere.
- **Tagging (`@smoke`)** — PR job runs a fast subset, cron runs everything.
- **Network mocking** — deterministic UI tests via `page.route`.
- **CI-only retries + trace/video on failure** — flake absorption + debuggable artifacts.
- **Role/label/test-id locators** — resilient selectors, not brittle CSS.

## GitHub CI setup — TODO checklist (we'll wire these up later)

See the enumerated list handed over in chat. The `.github/workflows/` file is
intentionally **not** created yet.
