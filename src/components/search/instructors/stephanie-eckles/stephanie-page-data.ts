import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'

export async function loadStephanieData(courseSlug: string) {
  const slugs = {
    courseSlug,
  }
  const data = await sanityClient.fetch(
    groq`
      {
        'courseSlug': ${stephanieQuery},
      }
  `,
    slugs,
  )

  return data
}

const stephanieQuery = groq`
*[slug.current == $courseSlug]{
  name,
  title,
  summary,
  path,
  'slug': resources[0]->_id,
  'instructor': collaborators[]->[role == 'instructor']{
      title,
    role,
    'name': person->name,
    'image': person->image.url
  },
  image
}
`
