import { defineContentConfig, defineCollection, z } from '@nuxt/content'

// Generators for each collection configuration
function createLandingCollection() {
  return defineCollection({
    type: 'page',
    source: 'index.md'
  })
}

function createTeamCollection() {
  return defineCollection({
    // YAML data file with team members
    type: 'data',
    source: 'team/team.yaml',
    schema: z.object({
      members: z.array(z.object({
        name: z.string(),
        role: z.string(),
        avatar: z.string(),
        profileUrl: z.string(),
        socials: z.array(z.object({ icon: z.string(), url: z.string() })).default([])
      }))
    })
  })
}

function createPartnersCollection() {
  return defineCollection({
    // YAML data file with partners
    type: 'data',
    source: 'team/partners.yaml',
    schema: z.object({
      partners: z.array(z.object({
        name: z.string(),
        logo: z.string(),
        clubs: z.array(z.string()).default([]),
        url: z.string()
      }))
    })
  })
}

function createDocsCollection() {
  return defineCollection({
    type: 'page',
    source: {
      include: '**',
      exclude: ['index.md', 'team.md']
    },
    schema: z.object({
      links: z.array(z.object({
        label: z.string(),
        icon: z.string(),
        to: z.string(),
        target: z.string().optional()
      })).optional()
    })
  })
}

// Assemble the content configuration
export default defineContentConfig({
  collections: {
    landing: createLandingCollection(),
    team: createTeamCollection(),
    partners: createPartnersCollection(),
    docs: createDocsCollection()
  }
})