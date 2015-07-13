# Contributing

**Please make sure your PR includes both tests and documentation.**

## Getting started

1. Clone the repository
2. Install dependencies: `npm install`
3. You can now add any changes needed.
4. Run unit test and linter: `npm test`

## File organization

All code, including tests, is written in next-generation JavaScript and transpiled using Babel. Source files are located in `src` and transpiled to `dist`, which is gitignored.

Tests should be placed in a `test` directory. Note that running tests uses JSDom, which requires io.js.

## Documentation

New features or API changes should be documented in the README.

## Code style

Code is linted using ESLint and babel-eslint. Rules are located in `.eslintrc`. Please do your best to maintain the existing code style.
