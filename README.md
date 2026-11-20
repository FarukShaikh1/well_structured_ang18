# FMS Collection – Angular Frontend

## 1. Project Overview

FMS Collection is an Angular-based frontend application developed to manage financial and collection-related activities.

### Technology Stack

| Technology            | Version / Details          |
| --------------------- | -------------------------- |
| Angular               | 18                         |
| TypeScript            | 5.4                        |
| Node.js               | Compatible with Angular 18 |
| npm                   | 12.2.3 (installed locally) |
| Bootstrap             | 5.3.8                      |
| RxJS                  | 7.8                        |
| ESLint                | 8.57                       |
| Prettier              | Code formatting            |
| Tabulator             | 6.3                        |
| Chart.js              | 4.4                        |
| Azure MSAL            | Authentication             |
| Azure Static Web Apps | Frontend hosting           |

## 2. Prerequisites

Install the following software before starting development:

- Node.js (Angular 18 compatible version)
- npm
- Visual Studio Code
- Angular CLI 18
- Git

Verify installations:

```bash
node --version
npm --version
ng version
git --version
```

Install Angular CLI if not already installed:

```bash
npm install -g @angular/cli@18
```

## 3. Project Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
```

### Step 2: Navigate to Project Directory

```bash
cd <project-folder>
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Development Server

```bash
npm start
```

Application URL:

```text
http://localhost:4200
```

## 4. Available npm Commands

The following commands are configured in `package.json`.

### 4.1 Development Server

| Command              | Description                           |
| -------------------- | ------------------------------------- |
| `npm start`          | Start the default development server  |
| `npm run start:dev`  | Start using Development configuration |
| `npm run start:qa`   | Start using QA configuration          |
| `npm run start:uat`  | Start using UAT configuration         |
| `npm run start:prod` | Start using Production configuration  |

### 4.2 Build Commands

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| `npm run build`      | Build the application                       |
| `npm run build:dev`  | Build for Development                       |
| `npm run build:qa`   | Build for QA                                |
| `npm run build:uat`  | Build for UAT                               |
| `npm run build:prod` | Build for Production                        |
| `npm run watch`      | Build continuously when source files change |

### 4.3 Testing Commands

| Command            | Description                      |
| ------------------ | -------------------------------- |
| `npm test`         | Execute unit tests               |
| `npm run test:cov` | Execute tests with code coverage |

### 4.4 Code Quality Commands

| Command            | Description                               |
| ------------------ | ----------------------------------------- |
| `npm run lint`     | Check ESLint issues                       |
| `npm run lint:fix` | Automatically fix supported ESLint issues |

### 4.5 Documentation Commands

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run docs`       | Generate project documentation |
| `npm run docs:serve` | Serve generated documentation  |

## 5. Code Formatting – Prettier

Prettier is used to maintain consistent formatting across TypeScript and Angular HTML files.

### Install Prettier

```bash
npm install --save-dev prettier
```

### Prettier Configuration

Create `.prettierrc` in the project root.

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "auto",
  "htmlWhitespaceSensitivity": "css"
}
```

### Prettier Ignore Configuration

Create `.prettierignore`.

```text
node_modules/
dist/
.angular/
coverage/
package-lock.json
```

### Formatting Commands

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run format`       | Format all TypeScript and HTML files     |
| `npm run format:check` | Check formatting without modifying files |

Add the following scripts to `package.json`:

```json
"format": "prettier --write \"**/*.{ts,html}\"",
"format:check": "prettier --check \"**/*.{ts,html}\""
```

### VS Code Extension

Install:

**Prettier - Code formatter**

Publisher: Prettier

Enable Format on Save in VS Code.

Recommended keyboard shortcuts:

| Shortcut           | Description                   |
| ------------------ | ----------------------------- |
| `Shift + Alt + F`  | Format current document       |
| `Ctrl + S`         | Save and automatically format |
| `Ctrl + Shift + P` | Open Command Palette          |

## 6. ESLint – Code Quality

ESLint is used to identify potential coding problems and maintain coding standards.

### Commands

```bash
npm run lint
```

Check ESLint issues across the project.

```bash
npm run lint:fix
```

Automatically fix supported ESLint issues.

### VS Code Extension

Install:

**ESLint**

Publisher: Microsoft

### Important

Prettier handles code formatting, while ESLint handles code quality and linting.

Both tools should be configured to work together without conflicting formatting rules.

## 7. VS Code Configuration

Recommended `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  "eslint.validate": ["javascript", "typescript", "typescriptreact", "html"],

  "eslint.format.enable": false,
  "eslint.alwaysShowStatus": true,

  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 8. Angular Development Guidelines

Follow these practices during development.

### TypeScript

- Use proper TypeScript interfaces and types.
- Avoid unnecessary use of `any`.
- Follow consistent naming conventions.
- Use `const` wherever possible.
- Keep components focused on their responsibilities.
- Move reusable business logic into services.
- Handle errors appropriately.
- Remove unused variables and imports.

### Angular Components

- Follow Angular standalone component architecture.
- Use reusable components wherever possible.
- Keep component logic clean and maintainable.
- Use Angular dependency injection.
- Use lifecycle hooks appropriately.
- Avoid unnecessary subscriptions and memory leaks.

### HTML Templates

- Use semantic HTML elements.
- Keep templates clean and readable.
- Avoid complex business logic inside templates.
- Use reusable components.
- Maintain consistent indentation.
- Follow Angular template best practices.

### Services and API Integration

- Keep API calls inside Angular services.
- Use HttpClient for HTTP requests.
- Handle API errors consistently.
- Use RxJS operators appropriately.
- Avoid duplicating API integration logic.

### Styling

- Use Bootstrap 5 utility classes where appropriate.
- Maintain consistent application colors.
- Prefer reusable CSS classes.
- Avoid unnecessary inline styles.
- Maintain responsive layouts.

## 9. Environment Configuration

The project supports the following configurations:

| Environment | npm Command          |
| ----------- | -------------------- |
| Development | `npm run start:dev`  |
| QA          | `npm run start:qa`   |
| UAT         | `npm run start:uat`  |
| Production  | `npm run start:prod` |

Build commands:

```bash
npm run build:dev
npm run build:qa
npm run build:uat
npm run build:prod
```

Environment-specific settings should be maintained using Angular environment configuration files and the configurations defined in `angular.json`.

Never commit passwords, client secrets, private keys or other sensitive credentials to source control.

## 10. Unit Testing

Use Jasmine and Karma for unit testing.

Run all tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:cov
```

Coverage reports can be used to identify untested application code.

Recommended testing areas:

- Component creation.
- Component methods.
- Service methods.
- API integration.
- Form validations.
- Authentication and authorization.
- Error handling.

## 11. Project Documentation

Use Compodoc to generate Angular project documentation.

Generate documentation:

```bash
npm run docs
```

Start documentation server:

```bash
npm run docs:serve
```

Compodoc documentation helps developers understand components, services, modules, interfaces and project structure.

## 12. Git Workflow

Follow a consistent Git workflow.

### Check Current Changes

```bash
git status
```

### Create a Feature Branch

```bash
git checkout -b feature/feature-name
```

### Stage Changes

```bash
git add .
```

### Commit Changes

```bash
git commit -m "Add feature description"
```

### Push Changes

```bash
git push origin feature/feature-name
```

### Pull Latest Changes

```bash
git pull origin <branch-name>
```

### Recommended Commit Naming

| Prefix      | Purpose                |
| ----------- | ---------------------- |
| `feat:`     | New functionality      |
| `fix:`      | Bug fixes              |
| `refactor:` | Code restructuring     |
| `style:`    | Formatting and styling |
| `docs:`     | Documentation changes  |
| `test:`     | Test-related changes   |
| `chore:`    | Maintenance activities |

Examples:

```text
feat: add expense management screen
fix: resolve transaction calculation issue
refactor: improve common service methods
style: format Angular components
docs: update project README
```

## 13. Production Build

Before deploying to production, execute the following activities:

**Step 1: Install dependencies**

```bash
npm install
```

**Step 2: Format code**

```bash
npm run format
```

**Step 3: Check code quality**

```bash
npm run lint
```

**Step 4: Execute unit tests**

```bash
npm run test:cov
```

**Step 5: Create production build**

```bash
npm run build:prod
```

**Step 6: Verify the generated build**

Check the Angular build output directory configured in `angular.json`.

## 14. Deployment

The frontend can be deployed using Azure Static Web Apps.

Recommended deployment activities:

1. Verify the production environment configuration.
2. Execute the production build.
3. Verify the generated build files.
4. Configure the deployment pipeline.
5. Deploy the generated Angular application.
6. Verify the application URL.
7. Test authentication and API connectivity.
8. Verify application functionality after deployment.

Ensure that the Azure Static Web Apps deployment configuration points to the correct Angular build output directory.

## 15. Troubleshooting

| Issue                    | Recommended Solution                                  |
| ------------------------ | ----------------------------------------------------- |
| npm install fails        | Check Node.js and npm compatibility                   |
| Angular CLI not found    | Install Angular CLI globally                          |
| Port 4200 already in use | Start using another available port                    |
| Prettier not formatting  | Check default formatter configuration                 |
| ESLint errors            | Run `npm run lint`                                    |
| Formatting issues        | Run `npm run format`                                  |
| Build errors             | Check TypeScript and Angular compilation errors       |
| API connection fails     | Verify API URL and environment configuration          |
| Authentication fails     | Verify authentication configuration and redirect URLs |

## 16. Recommended Development Workflow

Follow this sequence for regular development:

1. Pull the latest changes from Git.
2. Install dependencies if required.
3. Create a feature branch.
4. Develop the required functionality.
5. Format TypeScript and HTML files.
6. Run ESLint.
7. Execute unit tests.
8. Verify the application locally.
9. Commit changes.
10. Push changes to the remote repository.
11. Create a pull request.
12. Deploy after approval.

### Quick Reference – Daily Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Format complete project
npm run format

# Check formatting
npm run format:check

# Check code quality
npm run lint

# Fix supported lint issues
npm run lint:fix

# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Build application
npm run build

# Build production application
npm run build:prod
```

---

**Project:** FMS Collection Frontend

**Framework:** Angular 18

**Purpose:** Financial and collection management application

**Documentation:** README.md

**Last Updated:** November 2026
