import React, {FunctionComponent} from 'react'
import Card, {CardResource} from './card'
import Link from 'next/link'
import Image from 'next/image'
import {map, get, isEmpty} from 'lodash'
import Textfit from 'react-textfit'
import Markdown from 'react-markdown'
import {useViewer} from 'context/viewer-context'
import useEggheadSchedule, {ScheduleEvent} from 'hooks/use-egghead-schedule'
import {loadUserProgress} from 'lib/users'
import {track} from 'utils/analytics'
import Collection from './collection'
import axios from 'utils/configured-axios'
import VideoCard from 'components/pages/home/video-card'
import WhatsNew from 'pages/new'
import {HorizontalResourceCard} from 'components/card/horizontal-resource-card'

const Home: FunctionComponent<any> = ({homePageData}) => {
  const location = 'home landing'
  const {viewer, loading} = useViewer()
  const [progress, setProgress] = React.useState<any>([])

  const video: any = get(homePageData, 'video')
  let featured: any = get(homePageData, 'featured.resources', {})
  const devEssentials: any = get(homePageData, 'devEssentials')
  const freeCourses: any = get(homePageData, 'freeCourses')
  const getStarted: any = get(homePageData, 'getStarted')
  const stateManagement: any = get(homePageData, 'stateManagement')
  const aws: any = get(homePageData, 'aws')
  const workflows: any = get(homePageData, 'workflows')
  const accessibleApps: any = get(homePageData, 'accessibleApps')
  const accessibleReactApps: any = get(homePageData, 'accessibleReactApps')
  const projectFeatureCardVideoApp: any = get(homePageData, 'nextjsVideoApp')
  const wordpressWithGraphql: any = get(homePageData, 'cms')

  const tailwind: any = get(homePageData, 'tailwind')
  const portfolioProject: any = get(homePageData, 'portfolioProject')
  const topics: any = get(homePageData, 'topics')
  const swag: any = get(homePageData, 'swag')
  const ecommerce: any = get(homePageData, 'ecommerce')
  const featureDigitalGardening: any = get(
    homePageData,
    'featureDigitalGardening',
  )

  const featureWhatsNew: any = get(homePageData, 'featureWhatsNew')
  const concurrentReactTalk: any = get(
    homePageData,
    'react-concurrent-react-from-scratch',
  )
  const reactMetaphorTalk: any = get(
    homePageData,
    'drawing-the-invisible-react-explained-in-five-visual-metaphors',
  )
  const featureDeveloperPortfolio: any = get(
    homePageData,
    'featureDeveloperPortfolio',
  )

  React.useEffect(() => {
    if (viewer) {
      const loadProgressForUser = async (user_id: number) => {
        if (user_id) {
          const {data} = await loadUserProgress(user_id)
          setProgress(data)
        }
      }

      loadProgressForUser(viewer.id)
    }
  }, [viewer?.id])

  const ReactStateManagement = () => (
    <Card resource={stateManagement} className="text-center">
      <ol className="text-left">
        {stateManagement.resources.map((resource: any, index: any) => {
          return (
            <li key={resource.path} className="flex space-x-2 my-2">
              <span>{index + 1}</span>
              <Link href={resource.path}>
                <a className="font-bold hover:text-blue-600 dark:hover:text-blue-300">
                  {resource.title}
                </a>
              </Link>
            </li>
          )
        })}
      </ol>
    </Card>
  )

  return (
    <>
      {/* 
      <div>
        {currentCourseUrl && viewer && (
          <InProgressSection
            viewer={viewer}
            progress={progress}
            currentCourse={currentCourse}
            coursesInProgress={coursesInProgress}
          />
        )}
      </div> */}
      <div className="mt-8">
        <WhatsNew resource={featureWhatsNew} />

        <section className="mt-32">
          <h2 className="md:text-xl text-lg sm:font-semibold font-bold mb-3 dark:text-white text-center">
            Browse Curated Developer Resources on the Best Tools
          </h2>
          <TopicsList topics={topics} />
        </section>

        <section className="mt-20 sm:mt-24">
          <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
            egghead Talks and Events
          </h2>
          <div className="">
            <div className="grid lg:grid-cols-8 grid-cols-1 col-span-8 gap-4">
              <VideoCard className="lg:col-span-6" resource={video} />
              <EventSchedule />
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
              <HorizontalResourceCard
                resource={concurrentReactTalk}
                className="m-0 mt-4"
              />
              <HorizontalResourceCard
                resource={reactMetaphorTalk}
                className="m-0 lg:mt-4"
              />
            </div>
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <div className="flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50 overflow-hidden rounded-lg shadow-sm">
            <div className="px-5 sm:py-16 py-10 sm:text-left text-center">
              <div className="space-y-5 mx-auto flex items-center justify-center lg:px-8 w-full">
                <div className="flex lg:flex-row flex-col items-center justify-center sm:space-x-10 sm:space-y-0 space-y-5 0 w-full xl:pr-16">
                  <div className="flex-shrink-0">
                    <Link href={featureDeveloperPortfolio.path}>
                      <a tabIndex={-1}>
                        <Image
                          quality={100}
                          src={featureDeveloperPortfolio.image}
                          width={300}
                          height={300}
                          alt={featureDeveloperPortfolio.title}
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="flex flex-col sm:items-start items-center w-full">
                    <h3 className="text-xs text-yellow-600 dark:text-yellow-300 uppercase font-semibold mb-2">
                      Craft a Portfolio that gets you hired
                    </h3>
                    <Link href={featureDeveloperPortfolio.path}>
                      <a className="font-bold hover:text-blue-600 dark:hover:text-blue-300 transition ease-in-out">
                        <h2 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter">
                          {featureDeveloperPortfolio.title}
                        </h2>
                      </a>
                    </Link>
                    <Markdown
                      source={featureDeveloperPortfolio.cta}
                      className="prose dark:prose-dark dark:prose-md-dark prose-md mt-4"
                    />
                    <Link href={featureDeveloperPortfolio.path}>
                      <a className="inline-flex justify-center items-center px-5 py-3 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200 mt-4 font-semibold">
                        Join a Portfolio Project Club
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
            Popular Courses & Topics
          </h2>
          <div className="grid lg:grid-cols-3 grid-cols-1 space-y-3 lg:space-y-0 gap-4">
            <CardVerticalWithStack className="sm:py-3 py-2" data={getStarted} />
            <Card resource={tailwind} className="text-center">
              <ol className="text-left">
                {tailwind.resources.map((resource: any, index: any) => {
                  return (
                    <li key={resource.path} className="flex space-x-2 my-2">
                      <span>{index + 1}</span>
                      <Link href={resource.path}>
                        <a className="font-bold hover:text-blue-600 dark:hover:text-blue-300">
                          {resource.title}
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </Card>
            <ReactStateManagement />
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
            Staff Picks and Favorites
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
            <div className="flex flex-col col-span-1 space-y-4">
              {map(featured, (resource) => {
                return <CardVerticalLarge key={resource.path} data={resource} />
              })}
            </div>
            <div className="flex flex-col col-span-1 space-y-4">
              <CardVerticalWithStack data={devEssentials} />
              <Card resource={accessibleReactApps} className="text-center">
                <Collection />
              </Card>
            </div>
            <div className="flex flex-col col-span-1 space-y-4">
              <Card resource={accessibleApps} className="text-center">
                <Collection />
              </Card>
              <CardVerticalWithStack data={workflows} />
            </div>
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <div className="flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-50 overflow-hidden rounded-lg shadow-sm">
            <div className="px-5 sm:py-16 py-10 sm:text-left text-center">
              <div className="space-y-5 mx-auto flex items-center justify-center lg:px-8 w-full">
                <div className="flex lg:flex-row flex-col sm:space-x-12 sm:space-y-0 space-y-5 0 w-full xl:pr-16">
                  <div className="flex-shrink-0">
                    <Link href={featureDigitalGardening.path}>
                      <a tabIndex={-1}>
                        <Image
                          quality={100}
                          src={
                            'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1617475003/egghead-next-pages/home-page/eggo-gardening.png'
                          }
                          width={270}
                          height={330}
                          alt={featureDigitalGardening.title}
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="flex flex-col sm:items-start items-center w-full">
                    <h3 className="text-xs text-green-700 dark:text-green-400 uppercase font-semibold mb-2">
                      Learn in public with a digital garden
                    </h3>
                    <Link href={featureDigitalGardening.path}>
                      <a className="font-bold hover:text-blue-600 dark:hover:text-blue-300 transition ease-in-out">
                        <h2 className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter">
                          {featureDigitalGardening.title}
                        </h2>
                      </a>
                    </Link>
                    <div>
                      <Markdown className="prose dark:prose-dark dark:prose-sm-dark mt-4">
                        {featureDigitalGardening.description}
                      </Markdown>
                      <Markdown className="prose dark:prose-dark dark:prose-sm-dark mt-4 font-medium">
                        {featureDigitalGardening.quote.description}
                      </Markdown>
                    </div>
                    <div className="grid md:grid-cols-12 grid-cols-2 gap-5 mt-12">
                      {featureDigitalGardening.featured.courses.map(
                        (resource: any) => {
                          return (
                            <Card
                              className="col-span-4 text-center border border-gray-200"
                              key={resource.path}
                              resource={resource}
                              location={location}
                            />
                          )
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <h2 className="text-xl sm:font-semibold font-bold mb-3 dark:text-white">
            Build a New Portfolio Project
          </h2>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            <HorizontalResourceCard resource={portfolioProject} />
            <HorizontalResourceCard resource={ecommerce} />
          </div>
        </section>

        <section className="mt-20 sm:mt-24">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols 1 gap-4">
            <CardVerticalWithStack data={aws} />
            <CardVerticalWithStack
              data={freeCourses}
              memberTitle="Must Watch"
            />
            <div className="space-y-4">
              <Card
                className="text-center"
                resource={projectFeatureCardVideoApp}
              />
              <Card className="text-center" resource={wordpressWithGraphql} />
            </div>
          </div>
        </section>

        {/* <Card>
          <>
            <Link href={swag.path}>
              <a className="inline-block hover:text-blue-600">
                <h2 className="uppercase font-semibold text-xs text-gray-600 dark:text-gray-300">
                  {swag.name}
                </h2>
              </a>
            </Link>
            <Link href={swag.path}>
              <a className="inline-block hover:text-blue-600">
                <h3 className="text-lg tracking-tight font-bold leading-tight mb-1">
                  {swag.title}
                </h3>
              </a>
            </Link>
            <ul className="grid grid-cols-2 gap-3 mt-3">
              {map(get(swag, 'resources'), (resource) => (
                <li
                  className="py-1 flex flex-col items-center text-center  text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-300"
                  key={resource.path}
                >
                  {resource.image && (
                    <div className="flex-shrink-0">
                      <Link href={resource.path}>
                        <a
                          onClick={() => {
                            track('clicked home page swag', {
                              resource: resource.path,
                              linkType: 'image',
                            })
                          }}
                          tabIndex={-1}
                        >
                          <Image
                            className="rounded-lg"
                            src={resource.image}
                            alt={resource.title}
                            width={205}
                            height={205}
                          />
                        </a>
                      </Link>
                    </div>
                  )}
                  <Link href={resource.path}>
                    <a
                      onClick={() => {
                        track('clicked home page swag', {
                          resource: resource.path,
                          linkType: 'text',
                        })
                      }}
                      className="text-xs leading-tight"
                    >
                      {resource.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        </Card> */}
      </div>
    </>
  )
}

const TopicsList: React.FunctionComponent<{topics: CardResource}> = ({
  topics,
}) => {
  const allTopics = get(topics, 'resources', [])
  return (
    <>
      <div className="w-full">
        <ul
          className={`grid sm:grid-cols-4 md:grid-cols-8 grid-cols-2 sm:gap-5 md:gap-3 lg:gap-6 gap-4`}
        >
          {map(allTopics, (resource) => (
            <li key={resource.path}>
              <Link href={resource.path}>
                <a
                  onClick={() => {
                    track('clicked home page topic', {
                      topic: resource.title,
                    })
                    axios.post(`/api/topic`, {
                      topic: resource.slug,
                      amount: 1,
                    })
                  }}
                  className="w-full scale-100 hover:scale-105 transition-all ease-in-out duration-150 rounded-md py-2 px-3 space-x-1 text-base dark:text-white tracking-tight font-bold leading-tight flex items-center hover:text-blue-600"
                >
                  <div className="w-full flex flex-col items-center justify-center px-3 py-8 space-y-4">
                    {resource.image && (
                      <div className="flex items-center">
                        <Image
                          src={get(resource.image, 'src', resource.image)}
                          width={64}
                          height={64}
                          alt={`${resource.title} logo`}
                        />
                      </div>
                    )}
                    <div className="sm:text-base md:text-sm lg:text-base">
                      {resource.title}
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const EventSchedule: React.FunctionComponent = () => {
  const [schedule, scheduleLoading] = useEggheadSchedule(3)
  return (
    <Card className="lg:col-span-2 relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 text-white ">
      <>
        <h2 className="uppercase font-semibold text-xs text-blue-200">
          Upcoming Events
        </h2>
        {!isEmpty(schedule) ? (
          <ul className="mt-4 leading-tight space-y-3 relative z-10">
            {map(schedule, (resource: ScheduleEvent) => (
              <li className="w-full" key={resource.informationUrl}>
                <div className="font-semibold">
                  <div>
                    {resource.informationUrl ? (
                      <Link href={resource.informationUrl}>
                        <a className="hover:underline">{resource.title}</a>
                      </Link>
                    ) : (
                      resource.title
                    )}
                  </div>
                </div>
                <div className="w-full flex items-center mt-1">
                  {resource.subtitle && (
                    <time className="mr-1 tabular-nums text-xs">
                      {resource.subtitle}
                    </time>
                  )}
                  {resource.calendarUrl && (
                    <Link href={resource.calendarUrl}>
                      <a className="inline-flex rounded-md items-center font-semibold p-1 text-xs bg-blue-700 hover:bg-blue-800 text-white duration-150 transition-colors ease-in-out">
                        {/* prettier-ignore */}
                        <svg className="inline-flex" width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6z" fill="currentColor" /><path d="M10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z" fill="currentColor" /></g></svg>
                      </a>
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-4 leading-tight space-y-3 relative z-10">
            <li className="w-full">
              <div className="font-semibold">
                {scheduleLoading ? `` : `Nothing is scheduled at this time!`}
              </div>
            </li>
          </ul>
        )}
        <div
          className="absolute top-0 left-0 w-full h-full sm:opacity-25 opacity-25 pointer-events-none z-0"
          css={{
            backgroundImage:
              'url(https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606467202/next.egghead.io/eggodex/playful-eggo_2x.png)',
            backgroundSize: 200,
            backgroundPosition: 'bottom 5px right -5px',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </>
    </Card>
  )
}

type CardProps = {
  data: CardResource
  className?: string
  memberTitle?: string
}

const CardVerticalLarge: FunctionComponent<CardProps> = ({data}) => {
  const {path, image, title, name, byline} = data
  return (
    <Card className="border-none flex flex-col items-center justify-center text-center sm:py-8 py-6">
      <>
        {image && (
          <Link href={path}>
            <a
              onClick={() => {
                track('clicked home page resource', {
                  resource: path,
                  linkType: 'image',
                })
              }}
              className="mb-2 mx-auto w-32"
              tabIndex={-1}
            >
              <Image
                width={220}
                height={220}
                src={get(image, 'src', image)}
                alt={`illustration for ${title}`}
              />
            </a>
          </Link>
        )}
        <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">
          {name}
        </h2>
        <Link href={path}>
          <a
            onClick={() => {
              track('clicked home page resource', {
                resource: path,
                linkType: 'text',
              })
            }}
            className="hover:text-blue-600 dark:hover:text-blue-300"
          >
            <h3 className="md:text-lg text-base sm:font-semibold font-bold leading-tight">
              <Textfit mode="multi" min={14} max={20}>
                {title}
              </Textfit>
            </h3>
          </a>
        </Link>
        <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          {byline}
        </div>
      </>
    </Card>
  )
}

const CardVerticalWithStack: FunctionComponent<CardProps> = ({
  data,
  memberTitle,
}) => {
  const {viewer} = useViewer()
  const {name, title, description, path} = data
  return (
    <Card>
      <>
        <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">
          {(viewer?.is_pro || viewer?.is_instructor) && memberTitle
            ? memberTitle
            : name}
        </h2>
        {path ? (
          <Link href={path}>
            <a
              onClick={() => {
                track('clicked home page resource', {
                  resource: path,
                  linkType: 'text',
                })
              }}
              className="hover:text-blue-600 dark:hover:text-blue-300"
            >
              <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
                {title}
              </h3>
            </a>
          </Link>
        ) : (
          <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
            {title}
          </h3>
        )}
        <div>
          <Markdown
            source={description || ''}
            className="prose prose-sm dark:prose-dark dark:prose-dark-sm max-w-none mb-3 "
          />
          <Collection resource={data} />
        </div>
      </>
    </Card>
  )
}

export default Home
