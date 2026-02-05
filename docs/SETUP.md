# Setup Guide

This guide provides detailed instructions for setting up the Superbet Test Automation Framework.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running Tests](#running-tests)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: Version 20 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm**: Comes with Node.js
  - Verify installation: `npm --version`

- **Git**: For version control
  - Download from [git-scm.com](https://git-scm.com/)

### System Dependencies

#### Windows
- No additional dependencies required (Playwright handles everything)

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install -y \
  libnss3 \
  libnspr4 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libdbus-1-3 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2
```

#### macOS
- No additional dependencies required

## Installation

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd superbet-test-automation
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Playwright and its dependencies
- TypeScript and type definitions
- Testing utilities (Allure, Faker.js)
- Code quality tools (ESLint, Prettier)
- Husky for Git hooks

### Step 3: Install Playwright Browsers

```bash
npx playwright install --with-deps
```

This installs:
- Chromium
- Firefox
- WebKit
- System dependencies

### Step 4: Set Up Git Hooks

```bash
npm run prepare
```

This sets up Husky pre-commit hooks for:
- Linting
- Type checking
- Code formatting

### Step 5: Verify Installation

Run a simple test to verify everything works:

```bash
npm run test:ui:smoke
```

## Configuration

### Environment Setup

1. Copy environment template (if needed):
```bash
cp config/environments/local.env.example config/environments/local.env
```

2. Edit environment file:
```env
BASE_URL=https://superbet.ro
ENV=local
HEADLESS=false
RETRY_COUNT=0
TIMEOUT=60000
```

### Playwright Configuration

Edit `playwright.config.ts` to customize:

- **Test Directory**: Change `testDir` to point to your test files
- **Browsers**: Modify `projects` array to enable/disable browsers
- **Timeouts**: Adjust `timeout` and `actionTimeout` values
- **Retries**: Change `retries` for CI vs local
- **Workers**: Adjust `workers` for parallel execution

### Selectors Configuration

Update selectors in `tests/ui/selectors/selectors.ts` based on actual website structure.

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run UI tests only
npm run test:ui

# Run smoke tests
npm run test:ui:smoke

# Run regression tests
npm run test:ui:regression
```

### Advanced Options

```bash
# Run in headed mode (see browser)
npm run test:headed

# Run in debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/ui/specs/header-navigation.spec.ts

# Run tests matching pattern
npx playwright test --grep "header"

# Run on specific browser
npx playwright test --project=chromium

# Run with specific environment
ENV=staging npm test
```

### Parallel Execution

Tests run in parallel by default. Control parallelism:

```bash
# Run with 4 workers
npx playwright test --workers=4

# Run serially
npx playwright test --workers=1
```

## Docker Setup

### Start Monitoring Stack

```bash
docker-compose up -d
```

This starts:
- InfluxDB (port 8086)
- Grafana (port 3000)

### Access Grafana

1. Open http://localhost:3000
2. Login:
   - Username: `admin`
   - Password: `admin123`
3. Configure InfluxDB datasource (if needed)

### Run Tests in Docker

```bash
docker-compose --profile test run playwright
```

## Troubleshooting

### Issue: Tests Fail with Timeout

**Solution:**
1. Increase timeout in `playwright.config.ts`:
```typescript
timeout: 120000, // 2 minutes
```

2. Check network connectivity
3. Verify selectors are correct
4. Check if website is accessible

### Issue: Browsers Not Installing

**Solution:**
```bash
# Reinstall browsers
npx playwright install --with-deps

# Check system dependencies (Linux)
npx playwright install-deps
```

### Issue: TypeScript Errors

**Solution:**
```bash
# Check TypeScript version
npm list typescript

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Allure Report Not Generating

**Solution:**
1. Ensure tests have run: `npm test`
2. Check `allure-results` directory exists
3. Generate report: `npm run test:report:generate`

### Issue: Pre-commit Hooks Failing

**Solution:**
```bash
# Fix linting issues
npm run lint:fix

# Fix formatting
npm run format

# Skip hooks (not recommended)
git commit --no-verify
```

### Issue: Docker Containers Not Starting

**Solution:**
```bash
# Check Docker is running
docker ps

# Check ports are available
netstat -an | grep 3000
netstat -an | grep 8086

# Restart containers
docker-compose down
docker-compose up -d
```

### Issue: Metrics Not Pushing to Grafana

**Solution:**
1. Verify InfluxDB is running: `docker ps`
2. Check environment variables:
```bash
echo $INFLUX_URL
echo $INFLUX_DB
```
3. Test connection manually:
```bash
curl http://localhost:8086/ping
```

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand framework structure
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Check test examples in `tests/ui/specs/`

## Getting Help

If you encounter issues not covered here:

1. Check existing GitHub issues
2. Review test logs in `test-results/`
3. Check Allure reports for detailed error information
4. Contact the test automation team
