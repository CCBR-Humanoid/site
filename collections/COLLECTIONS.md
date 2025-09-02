## Collections directory overview

This folder contains @nuxt/content collection definitions. Each file wires a content source (Markdown, YAML, etc.) to a Zod schema and exports a `defineCollection` config.

### Goals
- Keep collection wiring separate from schema definitions
- Encourage reuse of schemas across multiple collections
- Keep `content.config.ts` small and declarative

### Conventions
- One collection per file, named by domain (e.g. `team.ts`, `partners.ts`, `blog.ts`, `carousel.ts`).
- Export a named constant `<domain>Collection` from each file.
- Import schemas from the schema barrel `../schema` (preferred); do not declare schemas here.
- Keep files focused on `defineCollection({ type, source, schema })` only.

### Example: team
File: `collections/team.ts`

```ts
import { defineCollection } from '@nuxt/content'
import { teamSchema } from '../schema'

export const teamCollection = defineCollection({
  type: 'data',
  source: 'team/team.yaml',
  schema: teamSchema
})
```

Schema lives in `schema/team.ts` (see `schema/SCHEMA.md` for details).

### Wire-up with a barrel (adopted)

We use a barrel in `collections/index.ts` that both re-exports named collections and provides a default mapping. `content.config.ts` imports this default object directly.

`collections/index.ts`:

```ts
export { landingCollection } from './landing'
export { teamCollection } from './team'
export { partnersCollection } from './partners'
export { docsCollection } from './docs'
export { blogCollection } from './blog'
export { carouselCollection } from './carousel'

import {
  landingCollection,
  teamCollection,
  partnersCollection,
  docsCollection,
  blogCollection,
  carouselCollection
} from './'

// Assemble the content configuration
const collections = {
  landing: landingCollection,
  team: teamCollection,
  partners: partnersCollection,
  docs: docsCollection,
  blog: blogCollection,
  carousel: carouselCollection
}

export default collections
```

`content.config.ts`:

```ts
import { defineContentConfig } from '@nuxt/content'
import collections from './collections'

export default defineContentConfig({ collections })
```

### Adding a new collection
1) Add or reuse a schema under `schema/` (export `<domain>Schema`).
2) Create `collections/<domain>.ts` that calls `defineCollection` with `type`, `source`, and the schema.
3) Export it from `collections/index.ts` (barrel).
4) Register it in `content.config.ts` under `collections`.

### Notes on the barrel
- The default export mapping defines the collection keys used by `queryCollection('<key>')`.
- Keep the keys stable (e.g., `landing`, `team`, `partners`, etc.).

### Tips
- `type: 'data'` for YAML/JSON; `type: 'page'` for Markdown/MDX.
- `source` is relative to the `content/` directory (supports globs like `blog/**`).
- Prefer stable, descriptive collection keys in `content.config.ts`.
- Keep editorial notes (what to edit) in `EDITING.md` and reference the source files.
