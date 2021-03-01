import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'

export async function loadHomePageData() {
  const slugs = {
    jumbotron: 'primary-jumbotron-cloudflare-workers-intro',
  }
  const data = await sanityClient.fetch(
    groq`
      {
        'jumbotron': ${jumbotronQuery},
      }
  `,
    slugs,
  )

  return data
}

const jumbotronQuery = groq`
*[slug.current == $jumbotron][0]{
  name,
  title,
  description,
  summary,
  byline,
  meta,
  path,
  'slug': resources[][0]->_id,
  'instructor': collaborators[]->[role == 'instructor'][0]{
    title,
    'slug': person->slug.current,
    'name': person->name,
    'path': person->website,
    'twitter': person->twitter,
    'image': person->image.url
  },
  'background': images[label == 'background'][0].url,
  'image': images[label == 'badge'][0].url,
}
`
