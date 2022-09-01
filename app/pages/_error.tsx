import { NextPageContext } from 'next'
import NextErrorComponent from 'next/error'
import Link from 'next/link'
import { useEffect } from 'react'

import { ErrorPage } from '@croncat-ui/ui'
import { processError } from '@croncat-ui/utils'

interface CustomErrorComponentProps {
  statusCode?: number
  error?: string
}

const CustomErrorComponent = ({
  statusCode,
  error,
}: CustomErrorComponentProps) => {
  useEffect(() => {
    error && console.error(error)
  }, [error])

  return (
    <ErrorPage
      title={`${statusCode ?? 'Unknown status'}: ${
        (statusCode && statusCodes[statusCode]) || 'Unknown error'
      }`}
    >
      <p>
        An error occured on this page.{' '}
        <Link href="/home">
          <a className="underline hover:no-underline">
            Consider returning home.
          </a>
        </Link>
      </p>

      {error && (
        <pre className="mt-6 text-xs text-error whitespace-pre-wrap">
          {error}
        </pre>
      )}
    </ErrorPage>
  )
}

CustomErrorComponent.getInitialProps = async (
  context: NextPageContext
): Promise<CustomErrorComponentProps> => {
  // This will contain the status code of the response.
  return {
    ...(await NextErrorComponent.getInitialProps(context)),
    // If error present, process with error recognizer
    ...(context.err && {
      error: processError(context.err, {}),
    }),
  }
}

export default CustomErrorComponent

const statusCodes: { [code: number]: string } = {
  400: 'Bad Request',
  404: 'Not Found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
}
