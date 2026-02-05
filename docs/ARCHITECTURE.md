# Architecture Documentation

This document describes the architecture and design patterns used in the Superbet Test Automation Framework.

## Table of Contents

1. [Overview](#overview)
2. [Design Patterns](#design-patterns)
3. [Project Structure](#project-structure)
4. [Layer Architecture](#layer-architecture)
5. [Data Flow](#data-flow)
6. [Best Practices](#best-practices)

## Overview

The framework follows a layered architecture with clear separation of concerns:

- **Test Layer**: Test specifications and test data
- **Page Object Layer**: Page objects and components
- **Facade Layer**: Complex operations abstraction
- **Builder Layer**: Test data generation
- **Base Layer**: Common functionality and utilities

## Design Patterns

### 1. Page Object Model (POM)

**Purpose**: Encapsulate page-specific logic and selectors

**Implementation**:
- `BasePage`: Abstract base class for all pages
- `BaseComponent`: Base class for reusable components
- Page classes extend `BasePage`
- Component classes extend `BaseComponent`

**Example**:
```typescript
class SportPage extends BasePage {
  async navigate(): Promise<void> { ... }
  async verifySidebarExists(): Promise<boolean> { ... }
}
```

### 2. Facade Pattern

**Purpose**: Simplify complex multi-step operations

**Implementation**:
- `NavigationFacade`: Simplifies navigation operations
- Wraps multiple page objects and components
- Provides high-level methods

**Example**:
```typescript
const facade = new NavigationFacade(page);
await facade.navigateToSportViaHeader();
```

### 3. Builder Pattern

**Purpose**: Construct complex test data objects

**Implementation**:
- `TestDataBuilder`: Base builder class
- `UserTestDataBuilder`: User data builder
- Uses Faker.js for data generation
- Fluent interface for chaining

**Example**:
```typescript
const user = new UserTestDataBuilder()
  .withEmail('test@example.com')
  .withPassword('password123')
  .build();
```

### 4. Factory Pattern

**Purpose**: Centralize object creation

**Implementation**:
- `PageFactory`: Creates page objects
- Reduces coupling between tests and page objects
- Simplifies object instantiation

**Example**:
```typescript
const sportPage = PageFactory.createSportPage(page);
```

### 5. Singleton Pattern

**Purpose**: Single configuration instance

**Implementation**:
- `ConfigManager`: Manages configuration
- Ensures consistent configuration access
- Loads environment-specific settings

**Example**:
```typescript
const config = ConfigManager.getInstance();
const baseUrl = config.getBaseUrl();
```

## Project Structure

```
tests/
├── ui/
│   ├── base/              # Base classes (POM foundation)
│   ├── pages/             # Page Objects (POM)
│   ├── components/        # Reusable components (POM)
│   ├── specs/             # Test specifications
│   ├── helpers/           # Utility helpers
│   └── selectors/         # Centralized selectors
└── api/
    ├── clients/           # API clients (empty structure)
    ├── models/            # Data models (empty structure)
    └── services/          # Service classes (empty structure)

utils/
├── builders/              # Builder pattern implementations
├── facades/               # Facade pattern implementations
└── reporters/             # Custom reporters

config/
├── environments/          # Environment configurations
└── ConfigManager.ts       # Singleton configuration manager
```

## Layer Architecture

### Test Layer

**Location**: `tests/ui/specs/`

**Responsibility**:
- Define test scenarios
- Use page objects and facades
- Assert test results
- Handle test data

**Example**:
```typescript
test('Verify header navigation', async ({ page }) => {
  const header = new HeaderComponent(page);
  await header.clickSportLink();
  await expect(page).toHaveURL(/.*\/pariuri-sportive/);
});
```

### Page Object Layer

**Location**: `tests/ui/pages/`, `tests/ui/components/`

**Responsibility**:
- Encapsulate page/component logic
- Provide reusable methods
- Handle element interactions
- Manage selectors

**Example**:
```typescript
class SportPage extends BasePage {
  async navigate(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/pariuri-sportive`);
    await this.waitForPageLoad();
  }
}
```

### Facade Layer

**Location**: `utils/facades/`

**Responsibility**:
- Simplify complex operations
- Coordinate multiple page objects
- Provide high-level APIs
- Reduce test complexity

**Example**:
```typescript
class NavigationFacade {
  async navigateToSportViaHeader(): Promise<SportPage> {
    await this.header.clickSportLink();
    await this.sportPage.waitForPageLoad();
    return this.sportPage;
  }
}
```

### Builder Layer

**Location**: `utils/builders/`

**Responsibility**:
- Generate test data
- Use Faker.js for randomization
- Provide fluent interface
- Support data customization

**Example**:
```typescript
const user = new UserTestDataBuilder()
  .withEmail()
  .withPassword()
  .build();
```

### Base Layer

**Location**: `tests/ui/base/`, `tests/ui/helpers/`

**Responsibility**:
- Provide common functionality
- Handle wait strategies
- Error handling
- Screenshot capture

**Example**:
```typescript
class BasePage {
  protected async waitForVisible(selector: string): Promise<void> {
    await WaitHelper.waitForElementVisible(this.page, selector);
  }
}
```

## Data Flow

### Test Execution Flow

```
Test Spec
  ↓
Facade (optional)
  ↓
Page Object / Component
  ↓
Base Page / Component
  ↓
Helper Utilities
  ↓
Playwright API
  ↓
Browser
```

### Test Data Flow

```
Test Spec
  ↓
Builder Pattern
  ↓
Faker.js
  ↓
Test Data Object
  ↓
Page Object
  ↓
Application
```

## Best Practices

### 1. Selector Management

- **Centralize selectors**: All selectors in `tests/ui/selectors/selectors.ts`
- **Use data-testid**: Prefer `data-testid` attributes
- **Avoid brittle selectors**: Don't use XPath or complex CSS
- **Document selectors**: Add comments for complex selectors

### 2. Page Object Design

- **One page = One class**: Each page has its own class
- **Public methods only**: Hide implementation details
- **Return page objects**: Methods can return other page objects
- **Wait for stability**: Always wait for page load

### 3. Test Organization

- **Group related tests**: Use `test.describe()` blocks
- **Use tags**: `@smoke`, `@regression` for test categorization
- **Descriptive names**: Test names should describe what they test
- **One assertion per test**: Keep tests focused

### 4. Error Handling

- **Custom error classes**: Use meaningful error messages
- **Screenshot on failure**: Automatic screenshot capture
- **Retry logic**: Configurable retry for flaky tests
- **Context in errors**: Include relevant context

### 5. Code Quality

- **TypeScript strict mode**: No `any` types
- **JSDoc comments**: Document all public methods
- **ESLint rules**: Enforce code standards
- **Pre-commit hooks**: Catch issues before commit

### 6. Test Data

- **Use builders**: Generate test data with builders
- **Faker.js**: Use for realistic test data
- **Data isolation**: Each test should be independent
- **Cleanup**: Clean up test data after tests

## Extension Points

### Adding New Pages

1. Create page class extending `BasePage`
2. Add selectors to `selectors.ts`
3. Implement page-specific methods
4. Add to `PageFactory` if needed

### Adding New Components

1. Create component class extending `BaseComponent`
2. Add selectors to `selectors.ts`
3. Implement component-specific methods
4. Use in page objects or tests

### Adding New Facades

1. Create facade class
2. Inject required page objects
3. Implement high-level operations
4. Use in test specifications

### Adding New Builders

1. Extend `TestDataBuilder<T>`
2. Define data interface
3. Implement builder methods
4. Use Faker.js for data generation

## Performance Considerations

- **Parallel execution**: Tests run in parallel by default
- **Selective execution**: Use tags to run specific test suites
- **Browser reuse**: Playwright reuses browser contexts
- **Resource cleanup**: Properly close pages and contexts

## Maintenance

- **Update selectors**: Keep selectors in sync with UI changes
- **Refactor regularly**: Improve code structure
- **Update dependencies**: Keep packages up to date
- **Document changes**: Update documentation with changes
