## Schema directory overview

This folder contains Zod schemas used by @nuxt/content collections. Keeping schemas here makes them reusable and independent from collection definitions.

### Goals
- Single source of truth for content shapes
- Reuse between multiple collections/components
- Keep collection config files small and focused

### Conventions
- Import `z` from `@nuxt/content` to stay version-aligned with Nuxt Content.
- Use `Infer` from `zod` for inferred types (avoid `z.infer` in type positions).
- Name files by domain, e.g. `team.ts`, `partners.ts`, `blog.ts`, `carousel.ts`.
- Export the top-level schema as `<domain>Schema` and sub-schemas with meaningful names.
- Re-export schemas and types from `schema/index.ts`. App code can import types via the `@schema` alias (see `nuxt.config.ts`).

### Example: team (with inferred types exported)
File: `schema/team.ts`

```ts
import { z } from '@nuxt/content'
import type { infer as Infer } from 'zod'

export const socialLinkSchema = z.object({
	icon: z.string(),
	url: z.string()
})

export const teamMemberSchema = z.object({
	name: z.string(),
	role: z.string(),
	avatar: z.string(),
	profileUrl: z.string(),
	socials: z.array(socialLinkSchema).default([])
})

export const teamSchema = z.object({
	members: z.array(teamMemberSchema).default([])
})

// Inferred types exported for app-wide reuse
export type SocialLink = Infer<typeof socialLinkSchema>
export type TeamMember = Infer<typeof teamMemberSchema>
export type Team = Infer<typeof teamSchema>
```

Usage in a collection definition (example):

```ts
import { defineCollection } from '@nuxt/content'
import { teamSchema } from '../schema'

export const teamCollection = defineCollection({
	type: 'data',
	source: 'team/team.yaml',
	schema: teamSchema
})
```

### Adding a new schema
1) Create a new file in `schema/` (e.g. `schema/carousel.ts`).
2) Define and export the top-level Zod schema (e.g. `carouselSchema`).
3) Export inferred types for that schema (e.g. `export type Carousel = z.infer<typeof carouselSchema>`).
4) Reference the schema from the matching collection in `collections/`.

### Tips
- Keep schemas minimal and focused; add `.describe()` for tricky fields.
- Prefer `.default([])` or `.default({})` to make content editing forgiving.
- For URLs, you can add `.url()`; for enums, prefer `z.enum([...])`.
- Export `z.infer<...>` types next to schemas to keep types and validation in sync.

### Why separate schemas from collections?
- Separates data shape (schema) from data source/wiring (collection).
- Enables reuse of sub-schemas across multiple collections or components.
- Eases testing and iteration without touching collection config.

### Importing inferred types in the app
Use schema-local types in components, composables, and server code to avoid duplication:

```ts
// Example in a component/composable
import type { TeamMember } from '@schema'

// Now TeamMember stays in sync with the schema
```

### Barrel exports
`schema/index.ts` re-exports both the schemas (values) and their inferred types. Keep value and type exports split to improve IDE ergonomics and avoid type/value namespace confusion:

```ts
// schema/index.ts
export { teamMemberSchema, teamSchema } from './team'
export type { SocialLink, TeamMember, Team } from './team'
// ...other exports
```

The `@schema` alias is configured in `nuxt.config.ts`:

```ts
alias: {
	'@schema': fileURLToPath(new URL('./schema', import.meta.url))
}
```
