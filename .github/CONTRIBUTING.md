# Contributing
Please familize yourself with the [GitHub Community Guidelines](https://help.github.com/articles/github-community-guidelines/) before contributing. 

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Run examples: `npm start`

### File Organization
All code is written in JavaScript and transpiled using Babel. 

Source files are located in the `src` directory. Test files are located in the `test` directory.

### Git
Git commit messages [should be written in the imperative](http://chris.beams.io/posts/git-commit/). 

A pre-commit hook will run tests and lint code when you make a commit. If needed, you can force a commit with `--no-verify`.

### Tests
Tests are written in Mocha and code style is maintained with ESLint.

### Dependencies
Please use Yarn instead of npm to upgrade dependencies.

You can interactively upgrade dependencies:

```
yarn upgrade-intractive
```

Or you can upgrade dependencies one by one. For example, to upgrade Redux, you would run a command like this:

```
yarn add redux@4.0.0 -D
```

Install [synp](https://github.com/imsnif/synp):

```
npm install -g synp
```

Sync package-lock.json with yark.lock with:

```
yarn generate-lockfile
```
