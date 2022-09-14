import '@croncat-ui/ui/styles/index.css'
import '@fontsource/inter/latin.css'
import '@fontsource/jetbrains-mono/latin.css'

import { appWithTranslation } from 'next-i18next'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil'

import { useRegisterAdaptersOnMount } from '@croncat-ui/common'
import { activeThemeAtom, mountedInBrowserAtom } from '@croncat-ui/state'
import {
  ErrorBoundary,
  Notifications,
  Theme,
  ThemeProvider,
} from '@croncat-ui/ui'
import { SITE_IMAGE, SITE_URL } from '@croncat-ui/utils'

import { AppLayout } from '@/components'

const InnerApp = ({ Component, pageProps }: AppProps) => {
  useRegisterAdaptersOnMount()

  const router = useRouter()

  const setMountedInBrowser = useSetRecoilState(mountedInBrowserAtom)
  const [_theme, setTheme] = useRecoilState(activeThemeAtom)
  const [themeChangeCount, setThemeChangeCount] = useState(0)
  const [accentColor, setAccentColor] = useState<string | undefined>()
  const theme = _theme

  const isHomepage = router.pathname === '/'

  // Indicate that we are mounted.
  useEffect(() => setMountedInBrowser(true), [setMountedInBrowser])

  // On theme change, update DOM and state.
  useEffect(() => {
    // Ensure correct theme class is set on document.
    Object.values(Theme).forEach((value) =>
      document.documentElement.classList.toggle(value, value === theme)
    )
    // Update theme change count.
    setThemeChangeCount((c) => c + 1)
  }, [theme])

  return (
    <ThemeProvider
      accentColor={accentColor}
      setAccentColor={setAccentColor}
      theme={theme}
      themeChangeCount={themeChangeCount}
      updateTheme={setTheme}
    >
      <ErrorBoundary>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>

        <Notifications />
      </ErrorBoundary>
    </ThemeProvider>
  )
}

const DApp = (props: AppProps) => {
  const { t } = useTranslation()

  return (
    <>
      <DefaultSeo
        additionalLinkTags={[
          {
            href: '/apple-touch-icon.png',
            rel: 'apple-touch-icon',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            href: '/favicon-32x32.png',
            rel: 'icon',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            href: '/favicon-16x16.png',
            rel: 'icon',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            href: '/site.webmanifest',
            rel: 'manifest',
          },
        ]}
        additionalMetaTags={[
          {
            name: 'viewport',
            content:
              'width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
          },
          {
            name: 'msapplication-TileColor',
            content: '#212529',
          },
          {
            name: 'theme-color',
            content: '#212529',
          },
        ]}
        description={t('meta.description')}
        openGraph={{
          url: SITE_URL,
          type: 'website',
          title: t('meta.title'),
          description: t('meta.description'),
          images: SITE_IMAGE ? [{ url: SITE_IMAGE }] : [],
        }}
        title={t('meta.title')}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

      <RecoilRoot>
        <InnerApp {...props} />
      </RecoilRoot>
    </>
  )
}

export default appWithTranslation(DApp)
