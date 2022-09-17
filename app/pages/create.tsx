import { useState, useMemo } from 'react'
import clsx from 'clsx'
import {
  ArrowPathRoundedSquareIcon,
  BanknotesIcon,
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
  AddressInput,
  Balance,
  Button,
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
  validateAddress,
  validatePositive,
  validateRequired,
} from '@croncat-ui/utils'
import {
  CadenceBoundaryComponent,
  CustomMessageComponent,
  DCAComponent,
  PayrollComponent,
  NetworkSignerComponent,
  RecipeSummaryComponent,
} from '@/../packages/actions'
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
    title: 'Dev Main Account',
    address: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    balance: { amount: '13370000', denom: 'ujuno' },
    chain: supportedChains.find(({chain_name})=>chain_name==='juno')
  },
  {
    title: 'Main Account 1',
    address: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    balance: { amount: '420690000', denom: 'uosmo' },
    chain: supportedChains.find(({chain_name})=>chain_name==='osmosis')
  },
]

const CreatePage: NextPage = () => {
  const { t } = useTranslation()
  const actions = [
    {
      Icon: ArrowPathRoundedSquareIcon,
      title: t('form.action_dca_title'),
      subtitle: t('form.action_dca_subtitle'),
      Component: DCAComponent,
    },
    {
      Icon: BanknotesIcon,
      title: t('form.action_payroll_title'),
      subtitle: t('form.action_payroll_subtitle'),
      Component: PayrollComponent,
    },
    {
      Icon: DocumentTextIcon,
      title: t('form.action_custom_title'),
      subtitle: t('form.action_custom_subtitle'),
      Component: CustomMessageComponent,
    },
  ]

  // const { register, control } = useFormContext()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(1)
  const [selectedAction, setSelectedAction] = useState(actions[0])

  const assetList = assets.find(({chain_name})=>chain_name==='juno')
  const tokens = assetList?.assets || []
  
  const formMethods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      // title: '',
      // description: '',
      // actionData: [],
    },
  })

  const nextSection = () => {
    setCurrentSectionIndex(currentSectionIndex + 1)
  }

  const prevSection = () => {
    setCurrentSectionIndex(currentSectionIndex - 1)
  }

  const accountCallback = (account) => {
    console.log('accountCallback', account)
  }

  const actionCallback = (action) => {
    console.log('actionCallback', action)
    setSelectedAction(action)
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

  return (
    <>
      <PageHeader title={t('title.create')} backgroundColor="#008F58" />

      <div className="py-8 md:py-12">
        <div className="px-2 mx-auto max-w-xl md:px-0">
          <FormProvider {...formMethods}>
            <form
              // onSubmit={handleSubmit(onSubmitForm, onSubmitError)}
            >

              <section id="0" className={clsx({
                'hidden': currentSectionIndex != 0,
              })}>
                <h3 className="text-xl mb-2">I want to…</h3>

                <ActionSelector actions={actions} onSelectedAction={actionCallback} />

                <selectedAction.Component />
              </section>

              <section id="1" className={clsx({
                'hidden': currentSectionIndex != 1,
              })}>
                <CadenceBoundaryComponent />  
              </section>

              <section id="2" className={clsx({
                'hidden': currentSectionIndex != 2,
              })}>
                <RecipeSummaryComponent />
              </section>

              <section id="3" className={clsx({
                'hidden': currentSectionIndex != 3,
              })}>
                <NetworkSignerComponent />
              </section>

              <section id="4" className={clsx({
                'hidden': currentSectionIndex != 4,
              })}>
                <div className="text-center">
                  <h3 className="text-xl mb-2">{t('form.recipe_success_title')}</h3>
                  <p>{t('form.recipe_success_subtitle')}</p>
                </div>

                <div className="my-24">
                  TODO: Recipe card, link to users recipes
                </div>
              </section>

              <footer className="flex justify-between">
                <Button variant="secondary" size='2xl' onClick={prevSection} className={clsx({
                  'invisible': currentSectionIndex === 0,
                })}>
                  <span>Back</span>
                </Button>
                <Button variant="primary" size='2xl' onClick={nextSection}>
                  <span>Next</span>
                </Button>
                
                {/* <div className="flex">
                  <SubmitButton label="Submit" variant="primary" className="ml-auto" />
                </div> */}
              </footer>

            </form>
          </FormProvider>

        </div>
      </div>
    </>
  )
}

export default CreatePage

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['translation'])),
    },
  }
}
