import * as React from 'react'
import {FunctionComponent} from 'react'
import {Resource} from 'types'
import Link from 'next/link'
import Image from 'next/image'
import {reject, isEmpty} from 'lodash'
import {track} from 'utils/analytics'

import axios from 'utils/configured-axios'

type BookmarksProps = {
  viewer: any
}

const Bookmarks: FunctionComponent<BookmarksProps> = ({viewer}) => {
  const watchLaterUrl = viewer?.watch_later_bookmarks_url
  const [bookmarks, setBookmarks] = React.useState([])
  const [loadingBookmarks, setLoadingBookmarks] = React.useState(true)

  React.useEffect(() => {
    setLoadingBookmarks(true)
    if (watchLaterUrl) {
      axios
        .get(watchLaterUrl)
        .then(({data}) => {
          setBookmarks(data.items)
        })
        .finally(() => setLoadingBookmarks(false))
    }
  }, [watchLaterUrl])

  return (
    <div className="">
      {loadingBookmarks || isEmpty(bookmarks) ? (
        <div>
          {loadingBookmarks
            ? 'loading...'
            : `You don't have any content bookmarked to watch later.`}
        </div>
      ) : (
        <ul className="space-y-5">
          {bookmarks.map((bookmark: any) => {
            return (
              <li className="flex items-center space-x-2" key={bookmark.slug}>
                {bookmark.square_cover_128_url && (
                  <div className="flex items-center flex-shrink-0">
                    <Image
                      width={32}
                      height={32}
                      src={bookmark.square_cover_128_url}
                    />
                  </div>
                )}
                <Link href={bookmark.path}>
                  <a className="group inline-flex items-center space-x-2">
                    <div className="group-hover:underline font-medium md:text-lg text-normal leading-tight">
                      {bookmark.title}
                    </div>
                  </a>
                </Link>
                <button
                  className="rounded text-xs px-2 py-1 justify-center items-center text-black dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200  dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out "
                  onClick={(e) => {
                    e.preventDefault()
                    axios.post(bookmark.toggle_favorite_url)
                    const lessBookmarks = reject(bookmarks, {
                      slug: bookmark.slug,
                    }) as []
                    track('removed bookmark', {
                      resource: bookmark.slug,
                    })
                    setBookmarks(lessBookmarks)
                  }}
                >
                  remove
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default Bookmarks
