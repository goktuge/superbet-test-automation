# Contributing Guidelines

Thank you for contributing to the Superbet Test Automation Framework! This document provides guidelines for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards others

## Getting Started

### Prerequisites

- Node.js 20+
- Git
- IDE with TypeScript support (VSCode recommended)

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
```bash
git clone <your-fork-url>
cd superbet-test-automation
```
3. Install dependencies:
```bash
npm install
npx playwright install --with-deps
```
4. Create a branch:
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Test changes
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

**Examples**:
```
feat(header): add search functionality test
fix(sport-page): correct sidebar selector
docs(readme): update setup instructions
```

## Coding Standards

### TypeScript

- **Strict mode**: Always use strict TypeScript
- **No `any` types**: Use proper types or `unknown`
- **Explicit return types**: Define return types for public methods
- **Interfaces over types**: Prefer interfaces for object shapes

### Code Style

- **ESLint**: Follow ESLint rules
- **Prettier**: Use Prettier for formatting
- **Line length**: Max 100 characters
- **Indentation**: 2 spaces

### Naming Conventions

- **Files**: PascalCase for classes, kebab-case for files
  - `HeaderComponent.ts`
  - `header-navigation.spec.ts`
- **Classes**: PascalCase
  - `SportPage`, `NavigationFacade`
- **Methods**: camelCase
  - `clickSportLink()`, `verifySidebarExists()`
- **Constants**: UPPER_SNAKE_CASE
  - `MAX_RETRIES`, `DEFAULT_TIMEOUT`
- **Selectors**: camelCase in objects
  - `HeaderSelectors.sportLink`

### Documentation

- **JSDoc**: Document all public methods
- **Comments**: Explain why, not what
- **README**: Update README for user-facing changes

**Example**:
```typescript
/**
 * Click Sport link in header
 * @throws {Error} If element is not found or not clickable
 */
async clickSportLink(): Promise<void> {
  await this.click(HeaderSelectors.sportLink);
}
```

## Testing Guidelines

### Writing Tests

1. **One test = One scenario**: Keep tests focused
2. **Descriptive names**: Test names should be clear
3. **Arrange-Act-Assert**: Follow AAA pattern
4. **Use tags**: `@smoke`, `@regression`
5. **Allure steps**: Use `allure.step()` for complex operations

**Example**:
```typescript
test('@smoke @regression - Verify Sport link navigation', async ({ page }) => {
  await allure.step('Navigate to homepage', async () => {
    await page.goto('/');
  });

  await allure.step('Click Sport link', async () => {
    const header = new HeaderComponent(page);
    await header.clickSportLink();
  });

  await allure.step('Verify URL', async () => {
    await expect(page).toHaveURL(/.*\/pariuri-sportive/);
  });
});
```

### Test Data

- **Use builders**: Generate test data with builders
- **Faker.js**: Use for realistic data
- **Isolation**: Each test should be independent
- **Cleanup**: Clean up after tests if needed

### Selectors

- **Centralize**: Add all selectors to `selectors.ts`
- **Data-testid**: Prefer `data-testid` attributes
- **Document**: Add comments for complex selectors
- **Update**: Keep selectors in sync with UI

## Pull Request Process

### Before Submitting

1. **Run tests**: Ensure all tests pass
   ```bash
   npm test
   ```

2. **Lint code**: Fix linting issues
   ```bash
   npm run lint:fix
   ```

3. **Type check**: Ensure no type errors
   ```bash
   npm run type-check
   ```

4. **Format code**: Format with Prettier
   ```bash
   npm run format
   ```

5. **Update docs**: Update documentation if needed

### PR Checklist

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Description

Include:
- **What**: What changes are made
- **Why**: Why these changes are needed
- **How**: How the changes work
- **Testing**: How to test the changes
- **Screenshots**: If UI-related

### Review Process

1. **Automated checks**: CI/CD runs automatically
2. **Code review**: At least one approval required
3. **Address feedback**: Make requested changes
4. **Merge**: Squash and merge preferred

## File Structure

### Adding New Pages

1. Create `tests/ui/pages/YourPage.ts`
2. Extend `BasePage`
3. Add selectors to `selectors.ts`
4. Implement page methods
5. Add tests in `specs/`

### Adding New Components

1. Create `tests/ui/components/YourComponent.ts`
2. Extend `BaseComponent`
3. Add selectors to `selectors.ts`
4. Implement component methods
5. Use in pages or tests

### Adding New Tests

1. Create `tests/ui/specs/your-feature.spec.ts`
2. Use page objects and facades
3. Add appropriate tags
4. Include Allure steps
5. Add assertions

## Common Issues

### Selector Not Found

- Check selector in browser DevTools
- Verify selector in `selectors.ts`
- Update selector if UI changed

### Test Flakiness

- Add explicit waits
- Use `waitForElementVisible()`
- Increase timeout if needed
- Check for race conditions

### Type Errors

- Check type definitions
- Use proper types (no `any`)
- Update interfaces if needed

## Getting Help

- **Documentation**: Check `docs/` folder
- **Issues**: Search existing issues
- **Team**: Contact test automation team
- **Code review**: Ask for help in PR comments

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Team communications

Thank you for contributing! 🎉
