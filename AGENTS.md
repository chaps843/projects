# Agent Guidelines for Zod v4 Codebase

## Build/Test/Lint Commands
- **Build**: `pnpm build`
- **Test all**: `pnpm test` or `pnpm vitest run`
- **Test single file**: `pnpm vitest run src/v4/classic/tests/array.test.ts`
- **Test watch mode**: `pnpm vitest` or `pnpm vitest src/v4/classic/tests/file.test.ts`
- **Format/Lint**: `pnpm biome check --write .`

## Import Style
- Always use `.js` extensions in imports, even for `.ts` files: `import * as core from "../core/index.js";`
- Prefer namespace imports over named imports: `import * as z from "zod/v4";`
- Order: external dependencies, then internal/relative imports

## Naming Conventions
- **camelCase**: functions, variables (`safeParse`, `minFive`)
- **PascalCase**: types, interfaces, classes (`ZodType`, `ZodError`)
- **$-prefix**: internal/core types (`$ZodType`, `$ZodIssue`)
- **_-prefix**: internal functions (`_parse`, `_safeParse`)

## Type Usage
- Heavy use of generics and conditional types
- Use `readonly` modifiers on interface properties
- Branded types for type refinement
- Type-only exports: `export type { infer, output, input }`

## Error Handling
- Prefer `safeParse()` pattern (returns `{ success: boolean; data?: T; error?: ZodError }`)
- Avoid throwing errors; use `parse()` only when throwing is intended
- Async variants: `parseAsync()`, `safeParseAsync()`

## Code Formatting
- **Indentation**: 2 spaces (no tabs)
- **Line length**: ~120 characters max
- Use JSDoc for deprecations: `/** @deprecated */`
- Pure annotations for tree-shaking: `/*@__PURE__*/`

## Testing Patterns (Vitest)
- Use `test("description", () => {...})` structure
- Imports: `import { expect, expectTypeOf, test } from "vitest";`
- Extensive use of `toMatchInlineSnapshot()` for error validation
- Type testing: `expectTypeOf<T>().toEqualTypeOf<U>()`
