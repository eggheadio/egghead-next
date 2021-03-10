import * as React from 'react'
import {useViewer} from '../../context/viewer-context'
import {GetServerSideProps} from 'next'
import {AUTH_DOMAIN, getAuthorizationHeader} from 'utils/auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'

const handleJoinTeam = async (token: string, router: any) => {
  try {
    await axios.post(
      `${AUTH_DOMAIN}//api/v1/accounts/team_invite/${token}`,
      {},
      {
        headers: {...getAuthorizationHeader()},
      },
    )

    toast.success("You've successfully joined this team", {
      icon: '✅',
    })

    router.replace('/')
  } catch (e) {
    toast.error(
      "There was an issue joining the team. Please contact the team's account administrator if the issue persists.",
      {
        duration: 6000,
        icon: '❌',
      },
    )
  }
}

const TeamInvite: React.FunctionComponent<{
  token: string
  teamData: any
}> = ({token, teamData}) => {
  const {authToken, loading} = useViewer()
  const router = useRouter()

  const alreadySignedIn = !loading && typeof authToken === 'string'

  return (
    <section className="mb-32">
      <div className="p-4 w-full">
        <div className="w-full mx-auto md:py-32 py-16 flex flex-col items-center justify-center text-gray-900 dark:text-trueGray-100">
          <h2 className="text-center text-3xl leading-9 font-bold">
            Team Invite
          </h2>
          <div className="sm:mt-8 mt-4 sm:mx-auto sm:w-full sm:max-w-xl">
            <p className="text-center pb-4">
              You've been invited by{' '}
              <span className="font-bold">{teamData.team_owner}</span> to join
              their team on egghead. Click 'Join Team' to accept the invitation
              and get full access to everything on egghead.
            </p>
            {!alreadySignedIn && (
              <p className="text-center mb-4 p-4 bg-blue-50 dark:bg-gray-800 rounded">
                You need to{' '}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors ease-in-out duration-150"
                >
                  sign in
                </a>{' '}
                before you can accept this invitation. Revisit this page after
                signing in to proceed.
              </p>
            )}
            <div className="flex justify-center items-center w-full">
              <button
                className={`text-white bg-green-600 border-0 py-2 px-8 focus:outline-none rounded
                    ${
                      alreadySignedIn
                        ? 'hover:bg-green-700'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                disabled={!alreadySignedIn}
                onClick={() => handleJoinTeam(token, router)}
              >
                Join Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const token = params && (params.token as string)
  const viewTeamInviteUrl = `${AUTH_DOMAIN}/api/v1/accounts/team_invite/${token}`
  const {data} = await axios.get(viewTeamInviteUrl)

  return {
    props: {
      teamData: data,
      token,
    },
  }
}

export default TeamInvite
