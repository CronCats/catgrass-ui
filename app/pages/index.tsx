import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { SuspenseLoader } from '@croncat-ui/common'
import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'
import { GradientWrapper, Logo, PageLoader } from '@croncat-ui/ui'

interface HomePageProps {}

const Home: NextPage<HomePageProps> = ({}) => {
  const { t } = useTranslation()

  return (
    <SuspenseLoader fallback={<PageLoader className="w-screen h-screen" />}>
      <GradientWrapper>
        <nav className="py-4 px-6 w-full bg-clip-padding bg-opacity-40 border-b backdrop-blur-xl border-inactive backdrop-filter">
          <div className="flex justify-between items-center mx-auto max-w-screen-lg">
            <Link href="/" passHref>
              <a className="flex items-center">
                <div className="mr-3">
                  <Logo size={32} />
                </div>
              </a>
            </Link>
          </div>
        </nav>
        <h1 className="mt-16 text-center md:mt-[33vh] hero-text">
          {t('splash.shortTagline')}
        </h1>
        <p className="px-4 my-10 mx-auto max-w-lg text-lg text-center text-secondary">
          {t('splash.longTagline')}
        </p>
        <div className="mx-auto">{/* <EnterAppButton /> */}</div>

        <div className="px-3 -mt-8">
          <div className="grid grid-cols-1 gap-2 my-10 font-mono md:grid-cols-3 caption-text">
            <div className="flex flex-wrap gap-6 items-center mx-2 text-xs">
              <p>
                {t('info.productVersion', {
                  versionNumber: process.env.NEXT_PUBLIC_CRONCAT_VERSION,
                })}
              </p>
            </div>
          </div>
        </div>
      </GradientWrapper>
    </SuspenseLoader>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  }
}
