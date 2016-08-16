# Contributing

**Please ensure pull requests include both tests and documentation.**

## Getting started

1. Clone the repository
2. Install dependencies: `npm install`
3. You can now add any changes needed.
4. Run unit test and linter: `npm run local-test`

## File organization

All code, including tests, is written in the latest version of JavaScript and transpiled using Babel. Source files are located in `src` and transpiled to `dist`, which is gitignored.

Tests should be placed in the `test` directory.

## Documentation

Changes to the API should be documented in the README. Breaking changes must be documented in the UPGRADING guide.

## Code style

Code is linted using ESLint and babel-eslint. Rules are located in `.eslintrc`. Please do your best to maintain the existing code style.
