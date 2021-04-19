import * as React from 'react'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from '../../utils/auth'
import Bookmarks from 'components/pages/users/dashboard/bookmarks'

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  params,
}) {
  const {loginRequired} = getTokenFromCookieHeaders(
    req.headers.cookie as string,
  )

  return {
    props: {
      loginRequired,
    },
  }
}

const Dashboard: React.FunctionComponent<LoginRequiredParams> = ({
  loginRequired,
}) => {
  const {viewer} = useViewer()

  return (
    <LoginRequired loginRequired={loginRequired}>
      <div className="mt-12 mb-32 max-w-screen-xl w-full mx-auto">
        <div>
          <h1 className="sm:text-3xl text-xl font-bold mb-3 leading-tight">
            Bookmarks
          </h1>
          <Bookmarks viewer={viewer} />
        </div>
        <div className="mt-16">
          <h1 className="sm:text-3xl text-xl font-bold mb-3 leading-tight">
            Watch History
          </h1>
          <Bookmarks viewer={viewer} />
        </div>
      </div>
    </LoginRequired>
  )
}

export default Dashboard
