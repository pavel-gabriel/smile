# src/

Application source code lives here.

## Structure

Organize subdirectories by layer or domain depending on the project type:

**For a web app (frontend + backend):**
```
src/
  client/       # Frontend code
  server/       # Backend code
  shared/       # Shared types, utilities, constants
```

**For a backend-only service:**
```
src/
  routes/       # HTTP route handlers
  services/     # Business logic
  models/       # Data models / ORM definitions
  middleware/   # Express/Fastify middleware
  utils/        # Pure utility functions
  config/       # App configuration
```

**For a CLI or automation tool:**
```
src/
  commands/     # Command definitions
  lib/          # Core logic
  utils/        # Helpers
```

## Rules

- Keep business logic out of route handlers — put it in `services/`.
- Keep `utils/` for pure functions with no side effects.
- Don't import from `tests/` in source code.
- Environment-specific config belongs in `config/`, not scattered through source files.
