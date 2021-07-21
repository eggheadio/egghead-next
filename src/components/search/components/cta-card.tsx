import Image from 'next/image'
import Link from 'next/link'
import {get} from 'lodash'

import {bpMinMD} from 'utils/breakpoints'
import {track} from 'utils/analytics'
import ExternalTrackedLink from 'components/external-tracked-link'

const CtaCard: React.FC<{location: string; trackTitle: string; resource: any}> =
  ({location, trackTitle, resource}) => {
    const {path, title, byline, description, image, background} = resource
    return (
      <ExternalTrackedLink
        eventName="clicked Instructor Landing page CTA"
        params={{location}}
        className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative text-center"
        href={path}
      >
        <div
          className="md:-mt-5 flex items-center justify-center bg-white dark:bg-gray-900 text-white overflow-hidden rounded-b-lg md:rounded-t-none rounded-t-lg shadow-sm"
          css={{
            [bpMinMD]: {
              minHeight: 477,
            },
          }}
        >
          <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
            <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl">
              <div className="flex flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5">
                <div className="flex-shrink-0">
                  <Link href={path}>
                    <a
                      tabIndex={-1}
                      onClick={() =>
                        track(trackTitle, {
                          resource: path,
                          linkType: 'image',
                        })
                      }
                    >
                      <Image
                        quality={100}
                        src={get(image, 'src', image)}
                        width={250}
                        height={250}
                        alt={get(image, 'alt', `illustration for ${title}`)}
                      />
                    </a>
                  </Link>
                </div>
                <div className="flex flex-col sm:items-start items-center">
                  <h2 className="text-xs text-gray-700 uppercase font-semibold mb-2">
                    {byline}
                  </h2>
                  <Link href={path}>
                    <a
                      className="text-xl font-extrabold leading-tighter text-gray-900  hover:text-blue-700"
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
                  <p className="mt-4 text-gray-900 ">{description}</p>
                </div>
              </div>
            </div>
          </div>
          <img
            className="absolute top-0 left-0 z-0 w-full"
            src={background}
            alt=""
          />
        </div>
      </ExternalTrackedLink>
    )
  }
export default CtaCard
