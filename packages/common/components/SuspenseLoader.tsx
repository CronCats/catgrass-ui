import { useRouter } from 'next/router'
import { ComponentType, Suspense, SuspenseProps } from 'react'
import { useRecoilValue } from 'recoil'

import { mountedInBrowserAtom } from '@croncat-ui/state'
import { ErrorBoundary } from '@croncat-ui/ui'

export interface SuspenseLoaderProps extends SuspenseProps {
  ErrorBoundaryComponent?: ComponentType
  forceFallback?: boolean
}

export const SuspenseLoader = ({
  ErrorBoundaryComponent = ErrorBoundary,
  forceFallback,
  fallback,
  children,
  ...props
}: SuspenseLoaderProps) => {
  const { isFallback, isReady } = useRouter()

  // Prevent loading on the server since Next.js cannot intuitively
  // pre-render Suspenses.
  const mountedInBrowser = useRecoilValue(mountedInBrowserAtom)

  return !mountedInBrowser || forceFallback || isFallback || !isReady ? (
    <>{fallback}</>
  ) : (
    <ErrorBoundaryComponent>
      <Suspense fallback={fallback} {...props}>
        {children}
      </Suspense>
    </ErrorBoundaryComponent>
  )
}
