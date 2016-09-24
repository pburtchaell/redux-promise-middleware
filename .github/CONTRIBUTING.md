# Contributing

**Pull requests must include tests and documentation.**

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Run example: `npm start`

## Making a Contribution

1. Check [the issues](https://github.com/pburtchaell/react-notification/issues) for "help wanted" labels.
2. Check if there is a pull request already open for this issue. If there is, please do not duplicate efforts by making another PR.
3. Commit the changes required to resolve the issue. Git commit messages [should be written in the imperative](http://chris.beams.io/posts/git-commit/).
4. If needed, add one or more unit test(s). **For new features and bug fixes, a unit test is required.** Follow the [red/green/refactor process](https://en.wikipedia.org/wiki/Test-driven_development#Development_style). 
5. Run tests and linter: `npm test`. Code is linted using ES Lint. Rules are located in `.eslintrc`. You must maintain the existing code style. **Tests must pass before the PR is merged.**
6. Document new features and/or API changes.

## File organization

All code, including tests, is written in next-generation JavaScript and transpiled using Babel. Source files are located in `src` and transpiled to `dist`, which is gitignored. Tests should be placed in a `test` directory.

## Contributors

- [Patrick Burtchaell](http://github.com/pburtchaell)
- [Thomas Hudspith-Tatham](https://github.com/tomatau)

