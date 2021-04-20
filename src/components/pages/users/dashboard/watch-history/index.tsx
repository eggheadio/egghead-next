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
    lessons,
    image_128_url,
    items = [],
  } = resource

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
    <div className="flex w-full items-center md:flex-row md:space-x-3 space-x-2">
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
      <div className="space-y-1 w-full pl-4">
        <div className="">
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
          {!isInProgress && series && (
            <div className="text-sm flex items-center text-coolGray-500">
              {series?.title}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WatchHistory
