# Contributing to Foreign Housing

Thank you for your interest in contributing to Foreign Housing! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/your-org/foreign-housing/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, etc.)

### Suggesting Features

1. Check existing [Issues](https://github.com/your-org/foreign-housing/issues) for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach

### Submitting Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/foreign-housing.git
   cd foreign-housing
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Write/update tests
   - Update documentation

4. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `refactor`: Code refactoring
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

## Development Setup

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15.x
- AWS Account (for full stack testing)

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   npm run test:watch  # Watch mode
   npm run test:coverage  # With coverage
   ```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for objects
- Use enums for constants

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow naming conventions:
  - Components: PascalCase
  - Files: kebab-case
  - Functions: camelCase

### CSS

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use semantic class names
- Avoid inline styles

### File Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Layout components
│   └── features/    # Feature-specific components
├── lib/             # Utilities and configurations
├── types/           # TypeScript type definitions
└── hooks/           # Custom React hooks
```

## Testing Guidelines

### Unit Tests

- Test individual functions and components
- Use descriptive test names
- Aim for high coverage
- Mock external dependencies

### Integration Tests

- Test component interactions
- Test API endpoints
- Test database operations

### E2E Tests

- Test critical user flows
- Test across different browsers
- Test responsive design

## Documentation

- Update README.md for major changes
- Add JSDoc comments for functions
- Update API.md for API changes
- Add inline comments for complex logic

## Review Process

1. All PRs require at least one review
2. CI checks must pass
3. Code coverage must not decrease
4. Documentation must be updated
5. Changelog must be updated for user-facing changes

## Deployment

Only maintainers can deploy to production:

1. Merge approved PRs to `main`
2. GitHub Actions automatically deploys
3. Monitor deployment status
4. Verify deployment health

## Questions?

- Open a [Discussion](https://github.com/your-org/foreign-housing/discussions)
- Join our [Discord](https://discord.gg/foreign-housing)
- Email: dev@foreign-housing.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Foreign Housing! 🏠
