
import { GetStaticProps, NextPage } from 'next'

import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'

const AccountsPage: NextPage = () => (
  <>

    <div className="p-4 space-y-6 max-w-6xl md:p-6">
      Hello :)
    </div>
  </>
)

export default AccountsPage

export const getStaticProps: GetStaticProps = async ({ locale }) => {

  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  }
}
