import React, {FunctionComponent} from 'react'
import {CardResource} from 'components/pages/home/card'
import Markdown from 'react-markdown'
import Link from 'next/link'
import Image from 'next/image'
import {get} from 'lodash'
import {bpMinMD} from 'utils/breakpoints'
import {track} from 'utils/analytics'

type JumbotronProps = {
  resource: CardResource
}

const Jumbotron: FunctionComponent<JumbotronProps> = ({resource}) => {
  const {
    path,
    image,
    title,
    byline,
    instructor,
    background,
    description,
  } = resource
  return (
    <div
      className="relative flex items-center justify-center bg-gray-900 dark:bg-gray-800 text-white overflow-hidden rounded-lg shadow-sm"
      css={{
        [bpMinMD]: {
          minHeight: 477,
        },
      }}
    >
      {/* <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-purple-500 w-full h-2 z-20" /> */}
      <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
        <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl lg:px-8 w-full">
          <div className="flex lg:flex-row flex-col items-center justify-center sm:space-x-10 sm:space-y-0 space-y-5 0 w-full xl:pr-16">
            <div className="flex-shrink-0">
              <Link href={path}>
                <a
                  tabIndex={-1}
                  onClick={() =>
                    track('clicked jumbotron resource', {
                      resource: path,
                      linkType: 'image',
                    })
                  }
                >
                  <Image
                    quality={100}
                    src={get(image, 'src', image)}
                    width={340}
                    height={340}
                    alt={get(image, 'alt', `illustration for ${title}`)}
                  />
                </a>
              </Link>
            </div>
            <div className="flex flex-col sm:items-start items-center w-full">
              <h2 className="text-xs text-green-300 uppercase font-semibold mb-2">
                {byline}
              </h2>
              <Link href={path}>
                <a
                  className="sm:text-2xl md:text-4xl text-xl max-w-screen-lg font-extrabold leading-tighter hover:text-green-300"
                  onClick={() =>
                    track('clicked jumbotron resource', {
                      resource: path,
                      linkType: 'text',
                    })
                  }
                >
                  <h1>{title}</h1>
                </a>
              </Link>
              <Link href={instructor.path}>
                <a
                  className="mt-4 flex items-center space-x-2 text-base group"
                  onClick={() =>
                    track('clicked instructor in jumbotron', {
                      instructor: instructor.slug,
                    })
                  }
                >
                  <Image
                    src={instructor.image}
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt={instructor.name}
                  />
                  <span className="group-hover:text-green-200">
                    {instructor.name}
                  </span>
                </a>
              </Link>
              {description && (
                <Markdown
                  source={description}
                  allowDangerousHtml={true}
                  className="mt-4 text-gray-200 text-base max-w-screen-sm"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <UniqueBackground
        className="absolute left-0 top-0 w-full h-full z-0 object-cover"
        background={background}
      />
    </div>
  )
}

const UniqueBackground = ({className, background}: any) => {
  return background ? (
    <Image
      priority={true}
      quality={100}
      className={className}
      alt=""
      layout="fill"
      src={
        background ||
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612373331/next.egghead.io/resources/introduction-to-cloudflare-workers-5aa3/introduction-to-cloudflare-workers-cover_2.png'
      }
    />
  ) : null
}

export default Jumbotron
