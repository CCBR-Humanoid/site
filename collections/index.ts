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