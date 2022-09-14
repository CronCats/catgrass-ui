import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'
import { PageHeader } from '@/components/PageHeader'

const ExplorePage: NextPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('title.explore')} />

      <div className="p-4 space-y-6 max-w-6xl md:p-6">TODO: Recipe list</div>
    </>
  )
}

export default ExplorePage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  }
}
