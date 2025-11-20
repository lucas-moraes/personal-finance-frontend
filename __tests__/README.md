# Tests Directory

This directory contains all test files for the Personal Finance Frontend application.

## Structure

- Place test files here with `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` extensions
- Organize tests by feature or component as needed
- Use subdirectories to mirror the `src` structure when appropriate

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

## Test Setup

- **Framework**: Vitest
- **Testing Library**: @testing-library/react
- **Environment**: jsdom
- **Configuration**: `vitest.config.ts` at the project root
- **Setup File**: `__tests__/setup.ts`

## Example

See `example.test.tsx` for a basic test example demonstrating component testing and simple assertions.

## Best Practices

1. Keep tests close to their purpose but separate from source code
2. Use descriptive test names that explain what is being tested
3. Follow the Arrange-Act-Assert pattern
4. Mock external dependencies when necessary
5. Focus on testing behavior, not implementation details
