```markdown
# shiftleft-ts-demo Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill describes the development patterns, coding conventions, and common workflows for the `shiftleft-ts-demo` repository. The project is a TypeScript codebase using the Express framework, with a focus on clear file organization, consistent coding style, and streamlined update workflows for controllers, dependencies, and deployment configuration.

## Coding Conventions

- **File Naming:**  
  Files use PascalCase.  
  _Example:_  
  ```
  src/Controllers/Login.ts
  src/Controllers/Order.ts
  ```

- **Import Style:**  
  Use relative imports.  
  _Example:_  
  ```typescript
  import { authenticate } from '../Utils/Auth';
  ```

- **Export Style:**  
  Use named exports.  
  _Example:_  
  ```typescript
  export function loginHandler(req: Request, res: Response) { ... }
  ```

- **Commit Messages:**  
  Freeform style, typically short (average ~35 characters).  
  _Example:_  
  ```
  Fix bug in Order controller validation
  Update package.json dependencies
  ```

## Workflows

### Update Controller File
**Trigger:** When you need to update the logic or fix a bug in a controller (e.g., Login or Order).
**Command:** `/update-controller`

1. Edit the relevant controller file in `src/Controllers` (e.g., `Login.ts` or `Order.ts`).
2. Commit the change with a message indicating which file was updated.
   ```
   git add src/Controllers/Login.ts
   git commit -m "Update Login controller logic"
   git push
   ```

### Update package.json
**Trigger:** When you need to add, remove, or update dependencies or scripts.
**Command:** `/update-package`

1. Edit `package.json` as needed.
2. Commit the change with a message indicating `package.json` was updated.
   ```
   git add package.json
   git commit -m "Update package.json dependencies"
   git push
   ```

### Empty Commit to Trigger Tests
**Trigger:** When you want to manually trigger the CI/CD pipeline or tests without changing any files.
**Command:** `/trigger-tests`

1. Create an empty commit.
   ```
   git commit --allow-empty -m "Trigger CI/CD pipeline"
   git push
   ```

### Update Dockerfile
**Trigger:** When you need to update the Docker build or deployment process.
**Command:** `/update-dockerfile`

1. Edit the `Dockerfile` as needed.
2. Commit the change with a message indicating the `Dockerfile` was updated.
   ```
   git add Dockerfile
   git commit -m "Update Dockerfile for new build step"
   git push
   ```

## Testing Patterns

- **Test File Naming:**  
  Test files follow the `*.test.*` pattern.
  _Example:_  
  ```
  src/Controllers/Login.test.ts
  ```
- **Testing Framework:**  
  Not explicitly detected. Check for common frameworks (e.g., Jest, Mocha) in `package.json`.

## Commands

| Command             | Purpose                                                   |
|---------------------|-----------------------------------------------------------|
| /update-controller  | Update logic or fix bugs in a controller file             |
| /update-package     | Add, remove, or update dependencies/scripts in package.json|
| /trigger-tests      | Manually trigger CI/CD pipeline or tests                  |
| /update-dockerfile  | Update the Dockerfile for build or deployment changes     |
```