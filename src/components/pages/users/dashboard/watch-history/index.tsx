import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {LessonResource} from 'types'
import {Resource} from 'types'
import Image from 'next/image'
import {first, get, isEmpty, filter, uniq} from 'lodash'

type WatchHistoryProps = {
  resources: [Resource]
}

type CompletedLessonProps = {
  resource: any
  small?: boolean
  className?: string
}

const WatchHistory: FunctionComponent<WatchHistoryProps> = ({resources}) => {
  const lessonsCompleted = uniq(
    filter(resources, {
      type: 'lesson',
      completed: true,
    }),
  )

  return (
    <div className="space-y-10">
      <div>
        <div className="space-y-4">
          {lessonsCompleted.map((resource: any) => {
            return <CompletedLesson resource={resource} key={resource.id} />
          })}
        </div>
      </div>
    </div>
  )
}

const CompletedLesson: FunctionComponent<CompletedLessonProps> = ({
  resource,
}) => {
  if (isEmpty(resource)) {
    return null
  }

  const {
    title,
    square_cover_480_url,
    series,
    slug,
    resource_progress,
    progress,
    type,
    path,
    duration,
    instructor,
    instructor_url,

    lessons,
    image_128_url,
    items = [],
  } = resource

  console.log(resource)

  const definedProgress = resource_progress || progress

  const {is_completed} = definedProgress || {}

  const completedLessonSlugs = get(
    definedProgress,
    'completed_lessons',
    [],
  ).map((lesson: LessonResource) => lesson.slug)

  const allLessons =
    lessons || items.filter((item: any) => item.type === 'lesson')

  const current_lesson: any = first(
    allLessons.filter(
      (lesson: LessonResource) => !completedLessonSlugs.includes(lesson.slug),
    ),
  )

  const isInProgress = definedProgress && !is_completed
  const resource_path = current_lesson?.path || path
  const image_url = square_cover_480_url || image_128_url

  return (
    <div className="grid grid-cols-12 w-full items-center pb-4 border-b border-gray-200">
      <div className="col-span-6 flex items-center flex-row md:space-x-4 space-x-2">
        {image_url && resource_path && (
          <Link href={resource_path}>
            <a
              onClick={() =>
                track(`clicked completed lesson`, {
                  slug: slug,
                  type: type,
                  location: 'completed lesson (image)',
                })
              }
              tabIndex={-1}
            >
              <Image src={image_url} alt={title} width={32} height={32} />
            </a>
          </Link>
        )}
        <Link href={resource_path || '#'}>
          <a
            className="dark:hover:text-blue-300 hover:text-blue-600"
            onClick={() =>
              track(`clicked completed lesson`, {
                slug: slug,
                type: type,
                location: 'completed lesson (title)',
              })
            }
          >
            <h3 className="text-base font-semibold mb-0.5">{title}</h3>
          </a>
        </Link>
      </div>
      <div className="col-span-3">
        {series && (
          <Link href={series?.url || '#'}>
            <a
              className="text-coolGray-500 dark:hover:text-blue-300 hover:text-blue-600"
              onClick={() =>
                track(`clicked completed lesson`, {
                  slug: slug,
                  type: type,
                  location: 'completed lesson (title)',
                })
              }
            >
              <h3 className="text-sm flex items-center">{series?.title}</h3>
            </a>
          </Link>
        )}
      </div>
      <div className="col-span-2">
        <Link href={instructor_url || '#'}>
          <a
            className="text-coolGray-700 dark:hover:text-blue-300 hover:text-blue-600"
            onClick={() =>
              track(`clicked completed lesson`, {
                slug: slug,
                type: type,
                location: 'completed lesson (title)',
              })
            }
          >
            <h3 className="text-sm flex items-center">
              {instructor.full_name}
            </h3>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default WatchHistory
