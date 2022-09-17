import { assets, chains } from 'chain-registry'
import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'react-i18next'

import { AccountNetwork } from '@croncat-ui/actions'
import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'
import { NetworkAccountSelector } from '@croncat-ui/ui'
import { chainColors } from '@croncat-ui/utils'

import { PageHeader } from '@/components/PageHeader'

const getChainData = (chain) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain.chain_name
  )
  const asset = assetList?.assets[0]

  return {
    accounts: [],
    network: {
      asset,
      chain,
      brandColor: chainColors[chain.chain_id],
    },
  }
}

const unsupportedChainIds = ['cosmoshub-4']
const supportedChainIds = Object.keys(chainColors).filter(
  (id) => !unsupportedChainIds.includes(id)
)
const accountNetworks: AccountNetwork[] = chains
  .filter((c) => supportedChainIds.includes(c.chain_id))
  .map(getChainData)
const soonAccountNetworks: AccountNetwork[] = chains
  .filter((c) => unsupportedChainIds.includes(c.chain_id))
  .map(getChainData)
const onConnectAccount = () => {}

// fake data
const account = {
  title: 'Main Account 1',
  address: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
  balance: { amount: '13370000', denom: 'ujuno' },
}
accountNetworks[0].accounts.push(account)

const AccountsPage: NextPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('title.my_accounts')} />

      <div className="py-8 md:py-12">
        <div className="px-2 mx-auto max-w-xl md:px-0">
          <h4 className="mb-2 text-xs tracking-widest text-gray-400 uppercase">
            Supported Networks
          </h4>

          <NetworkAccountSelector
            accountNetworks={accountNetworks}
            onConnectAccount={onConnectAccount}
          />

          <h4 className="mt-12 mb-2 text-xs tracking-widest text-gray-400 uppercase">
            Coming Soon
          </h4>

          <NetworkAccountSelector
            accountNetworks={soonAccountNetworks}
            disabled={true}
            onConnectAccount={onConnectAccount}
          />
        </div>
      </div>
    </>
  )
}

export default AccountsPage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  }
}
