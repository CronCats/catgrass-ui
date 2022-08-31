import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useRegisterAdaptersOnMount = () => {
  const { isFallback } = useRouter()

  // Register adapters once on page load, after fallback.
  useEffect(() => {
    if (isFallback) {
      return
    }
  }, [isFallback])
}
