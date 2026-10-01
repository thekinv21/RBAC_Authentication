# Authentication & Authorization Backend

NestJS 11 project. Express adapter.

## Role

You are a senior NestJS developer. Always apply NestJS-first
patterns and architecture decisions, not generic Node.js approaches.

## Code standards

- Never instantiate services directly (no `new PrismaClient()`,
  no `new SomeService()`) — always use constructor injection
- Every infrastructure integration gets its own module and service:
  src/lib/database/PrismaModule.ts + PrismaService.ts
  src/lib/notification/NotificationModule.ts + NotificationService.ts
- Mark infrastructure modules @Global() and import once in AppModule
- Feature modules go in src/modules/<name>/
- Shared guards, interceptors, decorators go in src/common/
- Use Nest CLI: nest g module / nest g service / nest g controller
- Always use PascalCase for NestJS module, controller, and service file names.
- Example: `NotificationModule.ts`, `NotificationController.ts`, `NotificationService.ts`.

## Skills

Do not load any skill by default. Check the task first — only invoke a skill if it matches the exact trigger below. Never invoke a skill just because it exists.

- `/architect` — before building something non-trivial with no plan yet
- `/review` — when a feature is done and needs a production check
- `/recover` — when something is broken and the fix isn't obvious
- `/remember` — at the start of a new session to restore context,
  and at the end to save progress

## Session continuity

REQUIRED — do not skip, do not wait to be asked:

- **First action of every session:** run `/remember restore` before doing anything else.
- **Last action of every session:** run `/remember save` before closing.

## Prisma Rules

- Use Prisma Orm 7
- Never instantiate `PrismaClient` manually.
- Use the globally registered `PrismaService`.
- Keep Prisma access inside services/repositories.
- Never expose Prisma models directly from controllers.
- Map database entities/results to DTOs before returning API responses.
- Use Prisma transactions for operations that must be atomic.

## Naming

- Classes: PascalCase
- Methods/functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- DTO classes: `<Action><Resource>Dto`
- Controllers: `<Feature>Controller.ts`
- Services: `<Feature>Service.ts`
- Modules: `<Feature>Module.ts`
- Guards: `<Name>Guard.ts`
- Decorators: `<Name>Decorator.ts

## Global Validation

- Configure NestJS global validation according to `nestjs-zod`.
- Prefer Zod-based validation over NestJS `ValidationPipe` with `class-validator`.
- Validation must happen before data reaches business logic.
- Invalid input must result in a consistent HTTP 400 response.

## DTO & Validation

- Use Zod as the primary validation and schema definition library.
- Use `nestjs-zod` for integrating Zod with NestJS.
- Do not use `class-validator` or `class-transformer` for request validation unless explicitly required.
- Every endpoint that accepts external input must define a Zod schema.
- Use `ZodDto` / `createZodDto` from `nestjs-zod` for NestJS DTO integration.
- Validate all external input at the application boundary.
- Use Zod schemas to define validation rules and API contracts.
- Keep validation schemas close to the feature that owns them.
- Reuse schemas when the same validation rules are required in multiple places.
- Do not duplicate validation logic between controllers and services.
- Business rules that require database access must remain in services, not Zod schemas.

## OpenAPI / Swagger

- Zod schemas are the source of truth for request validation.
- Keep Swagger/OpenAPI schemas synchronized with Zod schemas.
- Do not maintain separate validation rules manually in Swagger decorators when the same information can be derived from Zod.
