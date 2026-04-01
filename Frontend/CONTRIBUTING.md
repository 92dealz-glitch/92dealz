## Contributing to 234deals-frontend

Thanks for your interest in contributing! Please follow these guidelines to make collaboration smooth.

- **Code of Conduct**: Be respectful and constructive.
- **Issue First**: Open an issue to discuss larger changes before implementing.
- **Branching**: Create a branch from `main` named `feat/your-short-desc` or `fix/your-short-desc`.
- **Commits**: Use clear commit messages. Prefer Conventional Commits (e.g., `feat: add search input`).
- **Testing**: Run the app locally and ensure changes work:

```bash
npm install
npm run dev
```

- **Formatting & Linting**: Run formatting and linting before creating a PR:

```bash
npm run lint
npm run format
```

- **Pre-commit / CI**: Always run `npm run lint` (and fix or autofix issues) before committing. CI will also run the linter on pull requests; commits that fail lint should be fixed locally first.

Suggested quick workflow:

```bash
# install dev deps once
npm install

# run linter and auto-fix where possible
npm run lint -- --fix

# run formatter
npm run format

# run app locally to verify
npm run dev
```

- **Pull Requests**: Create a PR against `main`. Include a clear description, screenshots if UI changes, and link related issues.

- **Review**: Address feedback promptly. Keep PRs focused and small when possible.

Thank you — contributions help make this project better!
