import {
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

import { GetStaticProps, NextPage } from 'next'
// import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'
import { assets, chains, ibc } from 'chain-registry'
import { PageHeader } from '@/components/PageHeader'
import { ActionSelector, TokenSelector, NumberInput, InputLabel, SubmitButton, AccountSelector } from '@/../packages/ui'
import { chainColors } from '@croncat-ui/utils'

// TODO: fake data, remove once wallet finished
const getChainData = (chain) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain.chain_name
  )
  const asset = assetList?.assets[0]
  return {
    ...chain,
    asset,
    brandColor: chainColors[chain.chain_id],
  }
}

const unsupportedChainIds = ['cosmoshub-4']
const supportedChainIds = Object.keys(chainColors).filter(
  (id) => !unsupportedChainIds.includes(id)
)
const supportedChains = chains
  .filter((c) => supportedChainIds.includes(c.chain_id))
  .map(getChainData)

const accounts = [
  {
    title: 'Main Account 1',
    address: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    balance: { amount: '420690000', denom: 'uosmo' },
    chain: supportedChains.find(({chain_name})=>chain_name==='osmosis')
  },
  {
    title: 'DCA Into Account',
    address: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    balance: { amount: '13370000', denom: 'ujuno' },
    chain: supportedChains.find(({chain_name})=>chain_name==='juno')
  },
]

const ExplorePage: NextPage = () => {
  const { t } = useTranslation()
  // const { register, control } = useFormContext()

  const assetList = assets.find(({chain_name})=>chain_name==='osmosis')
  const tokens = assetList?.assets || []
  

  const accountCallback = (account) => {
    console.log('accountCallback', account)
  }

  const actionCallback = (action) => {
    console.log('actionCallback', action)
  }

  const tokenCallback = (token) => {
    console.log('tokenCallback', token)
  }

  const actions = [
    {
      Icon: ArrowPathRoundedSquareIcon,
      title: t('form.action_dca_title'),
      subtitle: t('form.action_dca_subtitle'),
    },
    {
      Icon: ArrowsRightLeftIcon,
      title: t('form.action_transfer_title'),
      subtitle: t('form.action_transfer_subtitle'),
    },
    {
      Icon: DocumentTextIcon,
      title: t('form.action_custom_title'),
      subtitle: t('form.action_custom_subtitle'),
    },
  ]

  return (
    <>
      <PageHeader title={t('title.create')} backgroundColor="#008F58" />

      <div className="py-8 md:py-12">
        <div className="px-2 mx-auto max-w-xl md:px-0">

          <h3 className="text-xl mb-2">I want to…</h3>

          <ActionSelector actions={actions} onSelectedAction={actionCallback} />

          <div aria-details='dca fields' className="my-8">
            <InputLabel name={t('form.from_account')} className="mb-2" />
            <AccountSelector accounts={accounts} onSelectedAccount={accountCallback} />

            <br />

            <InputLabel name={t('form.from_token')} className="mb-2" />
            <TokenSelector tokens={tokens} onSelectedToken={tokenCallback} />

            <br />

            <InputLabel name={t('form.amount_to_swap_total')} />

            <InputLabel name={t('form.amount_to_swap_each')} />
            {/* <NumberInput fieldName='swap_amount' register={register} /> */}

            <hr />

            <InputLabel name={t('form.to_account')} className="mb-2" />
            <AccountSelector accounts={accounts} onSelectedAccount={accountCallback} />

            <br />

            <InputLabel name={t('form.to_token')} className="mb-2" />
            <TokenSelector tokens={tokens} onSelectedToken={tokenCallback} />
          </div>

          <SubmitButton label="Next" variant="primary" />
        </div>
      </div>
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
