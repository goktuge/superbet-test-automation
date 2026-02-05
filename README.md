# Superbet Test Automation Framework

Enterprise-grade Playwright TypeScript test automation framework for Superbet.ro with modern design patterns, comprehensive CI/CD integration, and advanced reporting.

## 🚀 Features

- **Modern Design Patterns**: Page Object Model, Facade Pattern, Builder Pattern, Factory Pattern, Singleton Pattern
- **TypeScript**: Strict type checking with 100% type coverage
- **Multi-Browser Support**: Chromium, Firefox, WebKit, and mobile browsers
- **Advanced Reporting**: Allure Reports with detailed test steps
- **Metrics & Monitoring**: Grafana integration with InfluxDB for test metrics
- **CI/CD Ready**: GitHub Actions and Jenkins support
- **Docker Support**: Containerized test execution
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## 📁 Project Structure

```
superbet-test-automation/
├── tests/
│   ├── ui/
│   │   ├── pages/          # Page Object Models
│   │   ├── components/     # Reusable UI components
│   │   ├── fixtures/       # Test fixtures
│   │   ├── specs/          # Test specifications
│   │   ├── helpers/        # Test helpers
│   │   ├── selectors/      # Centralized selectors
│   │   └── base/           # Base classes
│   └── api/
│       ├── clients/        # API client classes (empty)
│       ├── models/         # Data models (empty)
│       └── services/       # Service classes (empty)
├── config/
│   ├── environments/       # Environment configurations
│   └── ConfigManager.ts    # Configuration singleton
├── utils/
│   ├── builders/           # Builder pattern for test data
│   ├── facades/            # Facade pattern implementations
│   └── reporters/          # Custom reporters
├── scripts/                # Utility scripts
├── docker/                 # Docker configurations
└── docs/                   # Documentation

```

## 🛠️ Setup

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd superbet-test-automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install --with-deps
```

4. Set up Husky for pre-commit hooks:
```bash
npm run prepare
```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run UI tests only
```bash
npm run test:ui
```

### Run smoke tests
```bash
npm run test:ui:smoke
```

### Run regression tests
```bash
npm run test:ui:regression
```

### Run in headed mode
```bash
npm run test:headed
```

### Run in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/ui/specs/header-navigation.spec.ts
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
```

## 📊 Reports

### Generate Allure Report
```bash
npm run test:report:generate
```

### View Allure Report
```bash
npm run test:report
```

## 🔧 Configuration

### Environment Variables

Create environment files in `config/environments/`:

- `local.env` - Local development
- `staging.env` - Staging environment
- `prod.env` - Production environment

Example:
```env
BASE_URL=https://superbet.ro
ENV=prod
HEADLESS=true
RETRY_COUNT=2
TIMEOUT=60000
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test directories
- Browser configurations
- Timeouts
- Retry logic
- Reporter settings

## 🐳 Docker

### Start Grafana and InfluxDB
```bash
docker-compose up -d
```

### Run tests in Docker
```bash
docker-compose --profile test run playwright
```

### Access Grafana
- URL: http://localhost:3000
- Username: admin
- Password: admin123

## 🔄 CI/CD

### GitHub Actions

The framework includes two workflows:

1. **e2e-tests.yml**: Runs on PRs and main branch pushes
   - PR: Smoke tests only
   - Main: Full regression suite
   - Manual trigger available

2. **nightly.yml**: Scheduled nightly test runs

### Jenkins

Use the provided `Jenkinsfile` for Jenkins CI/CD integration.

## 📈 Metrics & Monitoring

### Grafana Dashboard

The framework automatically pushes metrics to InfluxDB:
- Test pass/fail rates
- Test duration by browser
- Flaky test detection
- Historical trends

Access the dashboard at http://localhost:3000 after starting docker-compose.

### Manual Metrics Push
```bash
npm run push-metrics
```

## 🧹 Cleanup

Remove test artifacts:
```bash
npm run clean
```

## 📝 Code Quality

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatting
```bash
npm run format
npm run format:check
```

### Type Checking
```bash
npm run type-check
```

## 🐛 Debugging

### VSCode Debug Configuration

Use the provided `.vscode/launch.json` for debugging:
- Set breakpoints in test files
- Use F5 to start debugging
- Step through test execution

### Trace Viewer

View detailed test traces:
```bash
npx playwright show-trace trace.zip
```

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Architecture](docs/ARCHITECTURE.md) - Framework architecture
- [Contributing](docs/CONTRIBUTING.md) - Contribution guidelines

## 🎯 Test Scenarios

### Header Navigation Tests
- Validates all header links (Sport, Live, Supersocial, etc.)
- Verifies navigation functionality
- Tests user interaction elements

### Sport Page Tests
- Validates sidebar menu
- Tests sub-page navigation
- Verifies page elements and buttons

### Live Page Tests
- Validates sidebar links
- Tests navigation functionality

## 🤝 Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is proprietary and confidential.

## 🆘 Troubleshooting

### Common Issues

1. **Tests fail with timeout errors**
   - Increase timeout in `playwright.config.ts`
   - Check network connectivity
   - Verify selectors are correct

2. **Browsers not installing**
   - Run `npx playwright install --with-deps`
   - Check system dependencies

3. **Allure report not generating**
   - Ensure `allure-results` directory exists
   - Run tests first to generate results

For more help, see [SETUP.md](docs/SETUP.md) troubleshooting section.
