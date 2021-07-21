import groq from 'groq'
import Image from 'next/image'
import {get} from 'lodash'
import ExternalTrackedLink from 'components/external-tracked-link'

import SearchInstructorEssential from '../instructor-essential'
import CtaCard from 'components/search/components/cta-card'
import {VerticalResourceCollectionCard} from 'components/card/vertical-resource-collection-card'
import {VerticalResourceCard} from 'components/card/verticle-resource-card'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'

const SearchKentCDodds = ({instructor}: any) => {
  const {collection, courses, podcast, products, caseStudy} = instructor

  const [primaryCourse, secondCourse] = courses.resources

  return (
    <div className="max-w-screen-xl mx-auto">
      <SearchInstructorEssential
        instructor={instructor}
        CTAComponent={
          <CtaCard
            resource={primaryCourse}
            trackTitle="clicked instructor landing page CTA resource"
            location="Kent C. Dodds instructor page"
          />
        }
      />
      <section className="flex sm:flex-nowrap flex-wrap justify-between gap-4 mb-4 xl:px-0 px-5">
        <ExternalTrackedLink
          eventName="clicked testing javascript banner"
          location="Kent C. Dodds instructor page"
          href={get(products.testingJavascript, 'url')}
        >
          <Image
            quality={100}
            src={get(products.testingJavascript, 'image')}
            width={620}
            height={350}
            layout="intrinsic"
            alt={get(
              products.testingJavascript,
              'alt',
              `illustration for testingJavascript`,
            )}
          />
        </ExternalTrackedLink>
        <ExternalTrackedLink
          eventName="clicked epic react banner"
          location="Kent C. Dodds instructor page"
          href={get(products.epicReact, 'url')}
        >
          <Image
            quality={100}
            src={get(products.epicReact, 'image')}
            width={620}
            height={350}
            alt={get(products.epicReact, 'alt', `illustration for epicreact`)}
          />
        </ExternalTrackedLink>
      </section>

      <div className="flex gap-4 sm:flex-nowrap flex-wrap xl:px-0 px-5">
        <VerticalResourceCollectionCard
          className="sm:py-8 py-6 mx-auto max-w-md"
          resource={collection}
          location="Kent C. Dodds instructor Landing page"
        />
        <div className="flex flex-col">
          <HorizontalResourceCard
            className="mt-0"
            resource={podcast}
            location="Kent C. Dodds instructor Landing page"
          />
          <div className="flex gap-4 mt-4">
            <VerticalResourceCard
              resource={secondCourse}
              className="w-1/2 border-none flex flex-col items-center justify-center text-center sm:py-8 py-6"
              location="Kent C. Dodds instructor Landing page"
            />
            <VerticalResourceCard
              className="w-1/2  border-none flex flex-col items-center justify-center text-center sm:py-8 py-6"
              resource={caseStudy}
              location="Kent C. Dodds instructor Landing page"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default SearchKentCDodds

export const kentCDoddsQuery = groq`
*[_type == 'resource' && slug.current == 'kent-c-dodds-landing-page'][0]{
  title,
  'courses': resources[slug.current == 'instructor-landing-page-featured-courses'][0]{
    resources[]->{
       title,
       'description': summary,
       path,
       byline,
       image,
       'background': images[label == 'feature-card-background'][0].url,
       'instructor': collaborators[]->[role == 'instructor'][0]{
         'name': person->.name
       },
     }
    },
   'products': resources[slug.current == 'instructor-landing-page-featured-products'][0]{
     'epicReact': resources[slug.current == 'epicreact'][0]{
       url,
       image,
     },
     'testingJavascript': resources[slug.current == 'testingjavascript'][0]{
       url,
       image,
     }
   },
   'collection': resources[slug.current == 'instructor-landing-page-featured-collection'][0]{
     title,
     description,
     resources[]{
       title,
       select(_type == 'reference') =>
          @->{
           title,
           description,
           path,
           byline,
           image,
           'background': images[label == 'feature-card-background'][0].url,
           'instructor': collaborators[]->[role == 'instructor'][0]{
             'name': person->.name
           }
         },
 
       _type == 'resource' => {
         title,
         image,
         "path": url,
       }
     }
   },
   'podcast': resources[slug.current == 'instructor-landing-page-featured-podcast'][0]{
     title,
     'path': url,
     byline,
     description,
     image,
   },
   'caseStudy': resources[slug.current == 'instructor-landing-page-egghead-case-study'][0]{
    title,
    'path': url,
    byline,
    description,
    image,
  },
 }
`
