export { landingCollection } from './landing'
export { teamCollection } from './team'
export { partnersCollection } from './partners'
export { docsCollection } from './docs'
export { blogCollection } from './blog'
export { carouselCollection } from './carousel'
export { galleryCollection } from './gallery'

import {
  landingCollection,
  teamCollection,
  partnersCollection,
  docsCollection,
  blogCollection,
  carouselCollection,
  galleryCollection
} from './'

// Assemble the content configuration
const collections = {
  landing: landingCollection,
  team: teamCollection,
  partners: partnersCollection,
  docs: docsCollection,
  blog: blogCollection,
  carousel: carouselCollection,
  gallery: galleryCollection
}

export default collections