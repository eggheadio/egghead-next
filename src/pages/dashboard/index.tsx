import * as React from 'react'
import LoginRequired, {LoginRequiredParams} from 'components/login-required'
import {useViewer} from 'context/viewer-context'
import {GetServerSideProps} from 'next'
import {getTokenFromCookieHeaders} from '../../utils/auth'
import isEmpty from 'lodash/isEmpty'
import {loadUserProgress} from 'lib/users'
import Bookmarks from 'components/pages/users/dashboard/bookmarks'
import InProgressResource from 'components/pages/users/dashboard/activity/in-progress-resource'

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
  const [progress, setProgress] = React.useState<any>([])

  React.useEffect(() => {
    const loadProgressForUser = async (user_id: number) => {
      if (user_id) {
        const {data} = await loadUserProgress(user_id)
        setProgress(data)
      }
    }

    loadProgressForUser(viewer.id)
  }, [viewer?.id])

  return (
    <LoginRequired loginRequired={loginRequired}>
      <div className="mt-12 mb-32 max-w-screen-xl w-full mx-auto">
        <div className="grid grid-cols-2 gap-12">
          {!isEmpty(progress) && (
            <div className="flex flex-col space-y-2">
              <h2 className="text-xl pb-2 mb-3 border-b border-gray-200 dark:border-gray-800">
                Continue Learning
              </h2>
              {progress.map((item: any) => {
                return (
                  <InProgressResource
                    small
                    key={item.slug}
                    resource={item.collection}
                  />
                )
              })}
            </div>
          )}
          <div>
            <h1 className="text-xl pb-2 mb-3 border-b border-gray-200 dark:border-gray-800">
              Bookmarks
            </h1>
            <Bookmarks viewer={viewer} />
          </div>
        </div>
        <div className="mt-16">
          <h1 className="text-xl pb-2 mb-3 border-b border-gray-200 dark:border-gray-800">
            Watch History
          </h1>
          <Bookmarks viewer={viewer} />
        </div>
      </div>
    </LoginRequired>
  )
}

export default Dashboard
