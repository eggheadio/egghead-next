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
      <div className="mb-32 max-w-screen-xl w-full mx-auto">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-20">
          {!isEmpty(progress) && (
            <div className="flex flex-col space-y-2 mt-8">
              <h2 className="text-xl font-semibold pb-1 mb-3 border-b border-gray-200 dark:border-gray-800">
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
            <h1 className="mt-8 text-xl font-semibold pb-1 mb-6 border-b border-gray-200 dark:border-gray-800">
              Bookmarks
            </h1>
            <Bookmarks viewer={viewer} />
          </div>
        </div>
        <div className="mt-20">
          <h1 className="text-xl font-semibold pb-1 mb-6 border-b border-gray-200 dark:border-gray-800">
            Watch History
          </h1>
        </div>
      </div>
    </LoginRequired>
  )
}

export default Dashboard
