import {jsx} from '@emotion/core'
import React from 'react'

import * as yup from 'yup'
import {Formik} from 'formik'
import {useViewer} from 'context/viewer-context'

const loginSchema = yup.object().shape({
  email: yup.string().email().required('enter your email'),
})

function LoginForm() {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const {requestSignInEmail} = useViewer()

  return (
    <div className="text-text w-full  mx-auto flex flex-col justify-center sm:mt-24 mt-5">
      <img
        className="sm:w-40 sm:h-40 w-32 h-32 mx-auto mb-8"
        src={
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604394864/climbers.png'
        }
        alt="egghead climbers"
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-md rounded-lg">
        <h2 className="text-center text-3xl leading-9 font-semibold text-gray-900">
          {isSubmitted && 'Email Sent'}
          {isError && 'Something went wrong!'}
          {!isSubmitted && !isError && 'Sign into your account'}
        </h2>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" pb-8 px-4 sm:px-8">
            {!isSubmitted && !isError && (
              <Formik
                initialValues={{email: ''}}
                validationSchema={loginSchema}
                onSubmit={(values) => {
                  requestSignInEmail(values.email)
                    .then(() => {
                      setIsSubmitted(true)
                    })
                    .catch(() => {
                      setIsError(true)
                    })
                }}
              >
                {(props) => {
                  const {
                    values,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                  } = props
                  return (
                    <>
                      <form onSubmit={handleSubmit}>
                        <div>
                          <label
                            htmlFor="email"
                            className="block leading-6 text-gray-800"
                          >
                            Email address
                          </label>
                          <div className="mt-1 rounded-md shadow-sm">
                            <input
                              id="email"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="you@company.com"
                              required
                              className="bg-gray-200 focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal"
                            />
                          </div>
                        </div>
                        <div className="flex justify-center items-center w-full mt-6">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className=" transition duration-150 ease-in-out bg-gray-900 hover:bg-gray-700 hover:shadow-xl text-white font-semibold py-3 px-5 rounded"
                          >
                            Email a login link
                          </button>
                        </div>
                      </form>
                    </>
                  )
                }}
              </Formik>
            )}
            {isSubmitted && (
              <div className="text-text">
                <p>Please check your inbox for your sign in link.</p>
                <p>
                  Sometimes this can land in SPAM! While we hope that isn't the
                  case if it doesn't arrive in a minute or three, please check.
                </p>
              </div>
            )}
            {isError && (
              <div className="text-text">
                <p>
                  Login Link Not Sent{' '}
                  <span role="img" aria-label="sweating">
                    😅
                  </span>
                </p>
                <p className="pt-3">
                  Are you using an aggressive ad blocker such as Privacy Badger?
                  Please disable it for this site and reload the page to try
                  again.
                </p>
                <p className="pt-3">
                  If you <strong>aren't</strong> running aggressive adblocking
                  please check the console for errors and email
                  support@egghead.io with any info and we will help you ASAP.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Login() {
  return <LoginForm />
}

export default Login
