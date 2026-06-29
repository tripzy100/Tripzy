# Multi-Middleware Architectural Layer
To keep the main `middleware.ts` file clean and under the line-length limits, decompose specific middleware tasks (e.g. CSRF validation checks, session parsing, admin RBAC checks, rate limit logic) into separate helper functions within this directory, and import/invoke them sequentially in the root `middleware.ts`.
