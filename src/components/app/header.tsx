import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from '../link'
import Eggo from 'components/icons/eggo'
import {useViewer} from 'context/viewer-context'
import {track} from 'utils/analytics'
import {isEmpty} from 'lodash'
import Feedback from 'components/feedback-input'
import useBreakpoint from 'utils/breakpoints'
import {useRouter} from 'next/router'
import {useTheme} from 'next-themes'
import useCio from '../../hooks/use-cio'
import {Form, Formik} from 'formik'
import OnlinePresenceCTA from '../survey/online-presence-cta'

const Header: FunctionComponent = () => {
  const router = useRouter()
  const {viewer, loading} = useViewer()
  const {sm} = useBreakpoint()
  const [isOpen, setOpen] = React.useState<boolean>(false)

  React.useEffect(() => {
    !sm ? setOpen(sm) : setOpen(false)
  }, [sm, router])

  const isSearch = router.pathname.includes('/q')

  const Navigation: FunctionComponent<{
    className?: string
  }> = ({
    className = 'flex items-center justify-center space-x-1',
    children,
  }) => {
    return !loading ? (
      <div className="text-sm flex-shrink-0">
        {viewer ? (
          <div className={className}>
            {children}
            <OnlinePresenceCTA variant="header" />
            <Feedback
              user={viewer}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white active:bg-gray-200 rounded-md inline-flex transition-all ease-in-out duration-300 leading-tight"
            >
              Feedback
            </Feedback>
            {!isEmpty(viewer) && (
              <Link href={`/dashboard`}>
                <a
                  onClick={() =>
                    track('clicked dashboard', {
                      location: 'header',
                    })
                  }
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:hover:text-white rounded-md inline-flex transition-all ease-in-out duration-300 leading-tight"
                >
                  My Dashboard
                </a>
              </Link>
            )}
            {!isEmpty(viewer?.team_accounts) && (
              <Link href={`/team`}>
                <a
                  onClick={() =>
                    track('clicked team', {
                      location: 'header',
                    })
                  }
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:hover:text-black rounded-md inline-flex transition-all ease-in-out duration-300 leading-tight"
                >
                  Team
                </a>
              </Link>
            )}
            <Link href="/user">
              <a
                onClick={() =>
                  track('clicked account', {
                    location: 'header',
                  })
                }
                className="flex items-center space-x-2 p-3 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
              >
                <img
                  alt="avatar"
                  className="w-8 rounded-full"
                  src={viewer.avatar_url}
                />
                <span>
                  {viewer.name}
                  {viewer.is_pro && ' ⭐️'}
                </span>
              </a>
            </Link>
            <DarkModeToggle />
          </div>
        ) : (
          <div className={className}>
            {children}
            <div className="hidden lg:block">
              <Link href="/own-your-online-presence">
                <a className="inline-flex justify-center items-center px-4 py-2 rounded-md bg-blue-600 text-white transition-all hover:bg-blue-700 ease-in-out duration-200">
                  Own Your Online Presence
                </a>
              </Link>
            </div>
            <Link href="/login" activeClassName="bg-gray-100 dark:bg-gray-400">
              <a
                onClick={() =>
                  track('clicked sign in', {
                    location: 'header',
                  })
                }
                className="px-3 py-2 dark:active:text-gray-900 dark:text-gray-200 dark:border-gray-200 hover:opacity-100 hover:bg-gray-100  dark:hover:bg-gray-800  dark:active:bg-gray-700 active:bg-gray-100 rounded-md inline-flex transition-all ease-in-out duration-300"
              >
                Sign in
              </a>
            </Link>
            <DarkModeToggle />
          </div>
        )}
      </div>
    ) : null
  }

  return (
    <>
      <header className="h-16 px-5 py-5 sm:mb-5 mb-3 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between print:hidden dark:text-gray-100">
        <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto space-x-10">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <Eggo className="w-8 mr-1" />
                <span className="sm:inline-block hidden text-lg font-semibold dark:text-gray-200">
                  egghead.io
                </span>
              </a>
            </Link>
          </div>
          {!sm && !isSearch && <SearchBar />}
          {!sm && <Navigation />}
          {sm && !loading && (
            <button
              onClick={() => setOpen(!isOpen)}
              aria-labelledby="menubutton"
              aria-expanded={isOpen}
              className="p-1 -mr-2"
            >
              {isOpen ? <IconX /> : <IconMenu />}
            </button>
          )}
        </div>
      </header>
      {isOpen && (
        <>
          <Navigation className="flex flex-col items-start bg-white dark:bg-gray-900 p-3 w-full space-y-2 absolute top-14 z-50 shadow-xl dark:text-gray-100">
            {!isSearch && <SearchBar />}
          </Navigation>
        </>
      )}
    </>
  )
}

export default Header

const SearchBar = () => {
  const router = useRouter()
  return (
    <Formik
      initialValues={{
        query: '',
      }}
      onSubmit={(values) => {
        router.push(`/q?q=${values.query?.split(' ').join('+')}`)
        track('searched for query', {
          query: values.query,
          location: 'home',
        })
      }}
    >
      {({values, handleChange}) => {
        return (
          <Form role="search" className="w-full">
            <div className="flex items-center flex-grow space-x-2">
              <div className="relative w-full flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* prettier-ignore */}
                  <svg className="text-gray-400 dark:text-gray-600" width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
                </div>
                <input
                  name="query"
                  value={values.query}
                  onChange={handleChange}
                  type="search"
                  placeholder={`What do you want to learn today?`}
                  className="form-input border border-gray-100 dark:border-gray-700 text-black dark:text-white bg-gray-50 dark:bg-gray-800 dark:placeholder-gray-300 placeholder-gray-600 text-sm rounded-none rounded-l-md pr-1 py-2 pl-10 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className={`font-semibold px-4 py-2 rounded-none rounded-r-md transform bg-blue-600 hover:bg-indigo-600 hover:border-indigo-600 transition-all ease-in-out border border-blue-600 duration-200 text-white leading-5 text-sm`}
                >
                  Search
                </button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

const DarkModeToggle = () => {
  const [mounted, setMounted] = React.useState(false)
  const {subscriber, cioIdentify} = useCio()
  const {theme, setTheme} = useTheme()
  React.useEffect(() => setMounted(true), [])

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="rounded p-3 h-10 w-10"
      onClick={() => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(nextTheme)
        track(`toggled dark mode`, {
          mode: nextTheme,
        })
        if (subscriber) {
          cioIdentify(subscriber.id, {
            theme_preference: nextTheme,
          })
        }
      }}
    >
      {mounted && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          className="h-4 w-4 text-gray-800 dark:text-gray-200"
        >
          {theme === 'dark' ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          )}
        </svg>
      )}
    </button>
  )
}

const IconMenu = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)

const IconX = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none">
      <path
        d="M6 18L18 6M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)
