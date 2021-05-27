import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Markdown from 'react-markdown'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import Image from 'next/image'
import {find} from 'lodash'

type LandingProps = {
  course: any
}

const landingPage: FunctionComponent<LandingProps> = (props) => {
  const {course} = props
  const {title, ogImage, path, image, tags} = course

  const introduction: any = find(course?.projects?.content, {
    label: 'Introduction',
  })
  const projectBrief: any = find(course?.projects?.content, {
    label: 'Project Brief',
  })
  const appRequirements: any = find(course?.projects?.content, {
    label: 'App Requirements',
  })
  const appData: any = find(course?.projects?.content, {
    label: 'App Data',
  })
  const developmentStandards: any = find(course?.projects?.content, {
    label: 'Development Standards',
  })
  const stretchGoal: any = find(course?.projects?.content, {
    label: 'Stretch Goal',
  })
  const appDesign: any = find(course?.projects?.content, {
    label: 'App Design',
  })
  const Submission: any = find(course?.projects?.content, {label: 'Submission'})

  const {productCard, productPage} = course?.projects

  console.log(course)

  return (
    <>
      <NextSeo
        description={course.description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          description: course.description,
          site_name: 'egghead',
          images: [
            {
              url: ogImage,
            },
          ],
        }}
      />
      <div className="bg-gray-50 dark:bg-gray-900 sm:-my-5 -my-3 -mx-5 p-5">
        <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto">
          <div className="mt-10 mb-16 text-center">
            <div className="mb-10">
              <Image priority src={image} height="270" width="270" />
            </div>
            <p className="text-lg md:text-2xl leading-6 text-gray-500">
              Portfolio Project
            </p>
            <h1 className="text-2xl md:text-4xl font-bold mt-2">
              {course.projects.title}
            </h1>
          </div>
          <div className="flex flex-col justify-center items-start mx-auto max-w-screen-md mb-16 w-full px-4">
            <main className="prose dark:prose-dark prose-lg max-w-none w-full">
              <Markdown>{introduction.text}</Markdown>
              <Markdown>{projectBrief.text}</Markdown>
              <section className="grid grid-cols-2 gap-4">
                <Markdown className="col-span-1">
                  {appRequirements.text}
                </Markdown>
                <Markdown className="rounded mt-20">{appData.text}</Markdown>
              </section>
              <Markdown>{developmentStandards.text}</Markdown>
              <Markdown>{stretchGoal.text}</Markdown>
              <Markdown>{appDesign.text}</Markdown>
              <Markdown>{productPage.description}</Markdown>
              <Image
                src={productPage.url}
                height="826"
                width="736"
                className="rounded-md z-0"
              />
              <section className="grid grid-cols-2 mt-4 gap-4">
                <Markdown className="col-span-1">
                  {productCard.description}
                </Markdown>
                <Image
                  src={productCard.url}
                  height="390"
                  width="348"
                  className="rounded-md z-0"
                />
              </section>
              <Markdown>{Submission.text}</Markdown>
              <a
                className="inline-flex justify-center items-center px-6 py-4 font-semibold rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200"
                title="Share on twitter"
                href={course.projects.tweetCTA}
                rel="noopener"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                Tweet @eggheadio
              </a>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

const courseQuery = groq`
*[_type == 'resource' && externalId == $courseId]{
  title,
  path,
  tags,
  image,
  'ogImage': images[label == 'og-image'][0].url,
  resources[]{
    title,
    path
  },
	projects[0] {
    title,
    description,
		content,
    "productCard": images[label == 'product-card-design'][0] {
    url,
    description
  },
    "productPage": images[label == 'product-page-design'][0] {
    url,
    description
  },
  "tweetCTA": urls[label == 'tweetCTA'][0].url,
  },
}[0]`

async function loadCourse(id: number) {
  const params = {
    courseId: id,
  }

  const course = await sanityClient.fetch(courseQuery, params)
  return course
}

export async function getStaticProps() {
  const course = await loadCourse(447580)

  return {
    props: {
      course,
    },
  }
}

export default landingPage
