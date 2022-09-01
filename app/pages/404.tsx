import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { SuspenseLoader } from '@croncat-ui/common'
import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'
import { ErrorPage } from '@croncat-ui/ui'

const Custom404: NextPage = () => {
  const { t } = useTranslation()

  return (
    <SuspenseLoader fallback={null}>
      <ErrorPage title={t('title.404')}>
        <p>
          {t('error.pageNotFound')}{' '}
          <Link href="/">
            <a className="underline link-text">
              {t('info.considerReturningHome')}
            </a>
          </Link>
        </p>
      </ErrorPage>
    </SuspenseLoader>
  )
}

export default Custom404

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['translation'])),
  },
})
