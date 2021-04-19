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
              <li
                className="flex justify-between items-center"
                key={bookmark.slug}
              >
                <div className="flex items-center space-x-4">
                  {bookmark.square_cover_128_url && (
                    <div>
                      <Image
                        width={32}
                        height={32}
                        src={bookmark.square_cover_128_url}
                      />
                    </div>
                  )}
                  <Link href={bookmark.path}>
                    <a className="inline-flex items-center space-x-2">
                      <div className="hover:text-blue-600 font-medium text-lg leading-tight transition duration-150 ease-in-out">
                        {bookmark.title}
                      </div>
                    </a>
                  </Link>
                </div>
                <button
                  className="text-gray-500 hover:text-white p-1 bg-gray-50 hover:bg-red-400 rounded-xl transition duration-300 ease-in-out justify-self-end ml-5"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
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
