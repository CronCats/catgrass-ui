import { useState, useMemo } from 'react'
import {
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

import { GetStaticProps, NextPage } from 'next'
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'
import { assets, chains, ibc } from 'chain-registry'
import { PageHeader } from '@/components/PageHeader'
import {
  AccountSelector,
  ActionSelector,
  InputLabel,
  Loader,
  NumberInput,
  SubmitButton,
  TokenSelector,
} from '@/../packages/ui'
import {
  NATIVE_DECIMALS,
  NATIVE_DENOM,
  chainColors,
  validatePositive,
  validateRequired,
} from '@croncat-ui/utils'
import { CustomComponent } from '@/../packages/actions'
import { SuspenseLoader } from '@/../packages/common'

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

const CreatePage: NextPage = () => {
  const { t } = useTranslation()
  // const { register, control } = useFormContext()

  const assetList = assets.find(({chain_name})=>chain_name==='osmosis')
  const tokens = assetList?.assets || []
  
  const formMethods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      // title: '',
      // description: '',
      // actionData: [],
    },
  })

  const accountCallback = (account) => {
    console.log('accountCallback', account)
  }

  const actionCallback = (action) => {
    console.log('actionCallback', action)
  }

  const tokenCallback = (token) => {
    console.log('tokenCallback', token)
  }

  // const onSubmitForm: SubmitHandler<FormProposalData> = useCallback(
  //   ({ actionData, ...data }, event) => {
  //     setShowSubmitErrorNote(false)

  //     const nativeEvent = event?.nativeEvent as SubmitEvent
  //     const submitterValue = (nativeEvent?.submitter as HTMLInputElement)?.value

  //     if (submitterValue === ProposeSubmitValue.Preview) {
  //       setShowPreview((p) => !p)
  //       return
  //     }

  //     onSubmit({
  //       ...data,
  //       msgs: actionData
  //         .map(({ key, data }) => actionsWithData[key]?.transform(data))
  //         // Filter out undefined messages.
  //         .filter(Boolean) as CosmosMsgFor_Empty[],
  //     })
  //   },
  //   [onSubmit, actionsWithData]
  // )

  // const onSubmitError: SubmitErrorHandler<FormProposalData> = useCallback(
  //   () => setShowSubmitErrorNote(true),
  //   [setShowSubmitErrorNote]
  // )

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

          <FormProvider {...formMethods}>
            <form
              className="max-w-[800px]"
              // onSubmit={handleSubmit(onSubmitForm, onSubmitError)}
            >
              {/* <DCAComponent /> */}
              <CustomMessageComponent />
              <SubmitButton label="Next" variant="primary" />
            </form>
          </FormProvider>

        </div>
      </div>
    </>
  )
}

export default CreatePage

function DCAComponent() {
  const { register, watch, setValue, setError, clearErrors } = useFormContext()
  const { t } = useTranslation()

  const assetList = assets.find(({chain_name})=>chain_name==='osmosis')
  const tokens = assetList?.assets || []

  const fieldNamePrefix = 'form.'
  const spendTotalAmount = watch(fieldNamePrefix + 'amount_to_swap_total')
  const spendTotalDenom = watch(fieldNamePrefix + 'amount_to_swap_total_denom')
  const spendEachAmount = watch(fieldNamePrefix + 'amount_to_swap_each')
  const spendEachDenom = watch(fieldNamePrefix + 'amount_to_swap_each_denom')
  const [selectedToken, setSelectedToken] = useState(tokens[0])

  const accountCallback = (account) => {
    console.log('accountCallback', account)
  }

  const actionCallback = (action) => {
    console.log('actionCallback', action)
  }

  const tokenCallback = (token) => {
    console.log('tokenCallback', token)
    setSelectedToken(token)
  }

  const amountDecimals = useMemo(
    () => NATIVE_DECIMALS,
    [spendTotalDenom, selectedToken]
  )

  return (
    <div aria-details='dca fields' className="my-8">
      <InputLabel name={t('form.from_account')} className="mb-2" />
      <AccountSelector accounts={accounts} onSelectedAccount={accountCallback} />

      <br />

      <InputLabel name={t('form.from_token')} className="mb-2" />
      <TokenSelector tokens={tokens} onSelectedToken={tokenCallback} />

      <br />

      <InputLabel name={t('form.amount_to_swap_total')} className="mb-2" />
      <NumberInput
        // disabled={!isCreating}
        // error={errors?.amount}
        fieldName={fieldNamePrefix + 'amount_to_swap_total'}
        onMinus={() =>
          setValue(
            fieldNamePrefix + 'amount_to_swap_total',
            Math.max(
              Number(spendTotalAmount) - 1,
              1 / 10 ** amountDecimals
            ).toString()
          )
        }
        onPlus={() =>
          setValue(
            fieldNamePrefix + 'amount_to_swap_total',
            Math.max(
              Number(spendTotalAmount) + 1,
              1 / 10 ** amountDecimals
            ).toString()
          )
        }
        register={register}
        sizing="full"
        step={1 / 10 ** amountDecimals}
        defaultValue={10}
        validation={[validateRequired, validatePositive]}
      />

      <br />

      <InputLabel name={t('form.amount_to_swap_each')} className="mb-2" />
      <NumberInput
        // disabled={!isCreating}
        // error={errors?.amount}
        fieldName={fieldNamePrefix + 'amount_to_swap_each'}
        onMinus={() =>
          setValue(
            fieldNamePrefix + 'amount_to_swap_each',
            Math.max(
              Number(spendEachAmount) - 1,
              1 / 10 ** amountDecimals
            ).toString()
          )
        }
        onPlus={() =>
          setValue(
            fieldNamePrefix + 'amount_to_swap_each',
            Math.max(
              Number(spendEachAmount) + 1,
              1 / 10 ** amountDecimals
            ).toString()
          )
        }
        register={register}
        sizing="full"
        step={1 / 10 ** amountDecimals}
        defaultValue={1}
        validation={[validateRequired, validatePositive]}
      />

      <hr className="my-8 w-1/2 mx-auto border-2 border-gray-50" />

      <InputLabel name={t('form.to_account')} className="mb-2" />
      <AccountSelector accounts={accounts} onSelectedAccount={accountCallback} />

      <br />

      <InputLabel name={t('form.to_token')} className="mb-2" />
      <TokenSelector tokens={tokens} onSelectedToken={tokenCallback} />
    </div>
  )
}

function CustomMessageComponent() {
  // const { register, watch, setValue, setError, clearErrors } = useFormContext()
  const { t } = useTranslation()

  // const assetList = assets.find(({chain_name})=>chain_name==='osmosis')
  // const tokens = assetList?.assets || []

  const fieldNamePrefix = 'form.'
  // const spendTotalAmount = watch(fieldNamePrefix + 'amount_to_swap_total')
  // const spendTotalDenom = watch(fieldNamePrefix + 'amount_to_swap_total_denom')
  // const spendEachAmount = watch(fieldNamePrefix + 'amount_to_swap_each')
  // const spendEachDenom = watch(fieldNamePrefix + 'amount_to_swap_each_denom')
  // const [selectedToken, setSelectedToken] = useState(tokens[0])

  const accountCallback = (account) => {
    console.log('accountCallback', account)
  }

  // const actionCallback = (action) => {
  //   console.log('actionCallback', action)
  // }

  // const tokenCallback = (token) => {
  //   console.log('tokenCallback', token)
  //   setSelectedToken(token)
  // }

  // const amountDecimals = useMemo(
  //   () => NATIVE_DECIMALS,
  //   [spendTotalDenom, selectedToken]
  // )

  return (
    <div aria-details='custom message fields' className="my-8 w-full min-h-24">
      <InputLabel name={t('form.from_account')} className="mb-2" />
      <AccountSelector accounts={accounts} onSelectedAccount={accountCallback} />

      <br />
      <InputLabel name={t('form.custom_message')} className="mb-2" />
      <SuspenseLoader>
        <CustomComponent
          coreAddress={''}
          allActionsWithData={[]}
          index={0}
          data={[]}
          Logo={Loader}
          fieldNamePrefix={fieldNamePrefix}
          onRemove={() => {}}
          errors={[]}
          isCreating={true}
          Loader={Loader}
        />
      </SuspenseLoader>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  }
}
