// GNU AFFERO GENERAL PUBLIC LICENSE Version 3. Copyright (C) 2022 DAO DAO Contributors.
// See the "LICENSE" file in the root directory of this package for more copyright information.
import { assets, chains } from 'chain-registry'
import { GetStaticProps, NextPage } from 'next'

import { AccountNetwork } from '@croncat-ui/actions'
import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'
import { AccountSelector } from '@croncat-ui/ui'
import { chainColors } from '@croncat-ui/utils'

const getChainData = (chain) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain.chain_name
  )
  const asset = assetList?.assets[0]

  return {
    asset,
    chain,
    accounts: [],
    brandColor: chainColors[chain.chain_id],
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

const AccountsPage: NextPage = () => (
  <>
    <div className="py-12">
      <div className="mx-auto max-w-xl">
        <h4 className="mb-2 text-xs tracking-widest text-gray-400 uppercase">
          Supported Networks
        </h4>

        <AccountSelector
          accountNetworks={accountNetworks}
          onConnectAccount={onConnectAccount}
        />

        <h4 className="mt-12 mb-2 text-xs tracking-widest text-gray-400 uppercase">
          Coming Soon
        </h4>

        <AccountSelector
          accountNetworks={soonAccountNetworks}
          disabled={true}
          onConnectAccount={onConnectAccount}
        />
      </div>
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
