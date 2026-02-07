# Superbet E2E Test Automation

Playwright TypeScript E2E tests for **Superbet.ro**, with GitHub Actions CI, Allure reporting, and Grafana/InfluxDB metrics.

## Features

- **Superbet E2E**: UI tests (header, Sport, Live) and API tests; Page Object Model under `tests/ui`
- **CI**: GitHub Actions (`.github/workflows/e2e-tests.yml`) — smoke on PRs, regression on push, manual trigger
- **Allure**: Step-by-step reports; screenshots/video/trace on failure
- **Grafana + InfluxDB**: Test metrics via `utils/metrics/InfluxDBReporter.ts`; dashboards in Docker

## Project structure (core)

```
├── .github/workflows/
│   └── e2e-tests.yml       # CI: smoke, regression, manual
├── playwright.config.ts   # Playwright + Allure + InfluxDB reporter
├── tests/
│   ├── ui/                 # POM: pages, components, specs, helpers
│   └── api/                # API clients, models, services
├── utils/metrics/
│   └── InfluxDBReporter.ts # Pushes test execution metrics to InfluxDB
├── config/environments/    # local.env, staging.env, prod.env
├── docker/                 # Grafana + InfluxDB
└── scripts/               # cleanup, push-metrics
```

## Setup

- **Node.js 20+**, npm

```bash
git clone <repo-url>
cd superbet-test-automation
npm install
npx playwright install --with-deps
```

Optional: copy `config/environments/local.env` and set `BASE_URL`, `ENV`, `HEADLESS` as needed.

## Running tests

| Command | Description |
|--------|-------------|
| `npm test` | All tests |
| `npm run test:ui` | UI tests only |
| `npm run test:ui:smoke` | UI specs with `@smoke` |
| `npm run test:ui:regression` | UI specs with `@regression` |
| `npm run test:api` | API tests |
| `npx playwright test --project=chromium` | Single browser |

## Reports

- **Allure**: `npm run test:report:generate` then `npm run test:report` (or open `allure-report/`)
- **Playwright HTML**: `playwright-report/` after a run

## CI (GitHub Actions)

- **e2e-tests.yml**:
  - **PRs**: Smoke tests (Chromium) in Playwright Docker image; artifacts: `allure-results/`, `test-results/`
  - **Push to master**: Full regression (Chromium, Firefox, WebKit)
  - **Manual**: `workflow_dispatch` — choose environment and smoke/regression
- Report job merges Allure results and publishes to GitHub Pages.

## Grafana + InfluxDB

1. Start stack: `docker-compose up -d` (InfluxDB + Grafana).
2. Create an API token in InfluxDB (http://localhost:8086) for org `superbet`, bucket `playwright_metrics`.
3. Run tests with env set:
   - `INFLUX_URL`, `INFLUX_TOKEN`, optional `INFLUX_ORG`, `INFLUX_BUCKET`
4. Open Grafana at http://localhost:3000 (admin/admin123); datasource and dashboards are under `docker/grafana/`.

Metrics (from `InfluxDBReporter`): test execution, duration, status, browser, suite; tags (e.g. browser, status, environment) and fields (duration_ms, retry_count, passed, failed).

## Scripts

- `npm run clean` — remove test artifacts
- `npm run push-metrics` — push metrics script (if used)
- `npm run lint` / `npm run format` / `npm run type-check` — code quality

## License

Proprietary and confidential.
