import { GetStaticProps, NextPage } from 'next'

import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'

import { Nav } from '@/components'

const HomePage: NextPage = () => (
  <>
    <Nav />

    <div className="p-4 space-y-6 max-w-6xl md:p-6">TODO: Recipe list</div>
  </>
)

export default HomePage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  }
}
