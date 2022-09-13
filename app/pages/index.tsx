import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'react-i18next'

import { SuspenseLoader } from '@croncat-ui/common'
import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'
import { PageLoader } from '@croncat-ui/ui'

interface HomePageProps {}

const Home: NextPage<HomePageProps> = ({}) => {
  const { t } = useTranslation()

  return (
    <SuspenseLoader fallback={<PageLoader className="w-screen h-screen" />}>
      <div className="m-auto mt-40 mb-4 w-1/2 text-center">
        <h1 className="text-5xl font-bold">Hello</h1>
      </div>
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
