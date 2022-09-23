import {
  CadenceBoundaryComponent,
  CustomMessageComponent,
  DCAComponent,
  NetworkSignerComponent,
  PayrollComponent,
  RecipeSummaryComponent,
} from '@/../packages/actions'
import { ActionSelector, Button, SubmitButton } from '@/../packages/ui'
import {
  ArrowPathRoundedSquareIcon,
  BanknotesIcon,
  CakeIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'
import { assets, chains } from 'chain-registry'
import clsx from 'clsx'
import { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'
import {
  ComboInputSelectValue,
  RecipeCardComponent,
  SelectListValue,
} from '@croncat-ui/ui'
import { chainColors } from '@croncat-ui/utils'

import { PageHeader } from '@/components/PageHeader'

interface FormState {
  combo: ComboInputSelectValue
  interval: SelectListValue
}

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
    chain: supportedChains.find(({ chain_name }) => chain_name === 'juno'),
  },
  {
    title: 'Main Account 1',
    address: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    balance: { amount: '420690000', denom: 'uosmo' },
    chain: supportedChains.find(({ chain_name }) => chain_name === 'osmosis'),
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

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [selectedAction, setSelectedAction] = useState(actions[0])

  const assetList = assets.find(({ chain_name }) => chain_name === 'juno')
  const tokens = assetList?.assets || []

  const formMethods = useForm<FormState>({
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

  // const onSubmit = data => console.log(data)
  // const onSubmit: SubmitHandler<FormState> = (data) => console.log(JSON.stringify(data))
  const onSubmit: SubmitHandler<FormState> = (data) => {
    console.log(data)
    nextSection()
  }

  const successRecipeData = {
    title: 'Dollar Cost Average from $JUNO to $NETA',
    // subtitle: '',
    owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
    creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
    recipeHash:
      '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
    totalBalance: { amount: '10000000', denom: 'ujuno' },
    actions: [],
    rules: [],
    networks: [],
    bgColor: '#F9226C',
  }

  return (
    <>
      <PageHeader backgroundColor="#008F58" title={t('title.create')} />

      <div className="py-8 md:py-12">
        <div className="px-2 mx-auto max-w-xl md:px-0">
          <FormProvider {...formMethods}>
            <form
              // onSubmit={handleSubmit(onSubmitForm, onSubmitError)}
              onSubmit={formMethods.handleSubmit(onSubmit)}
            >
              <section
                className={clsx({
                  hidden: currentSectionIndex !== 0,
                })}
                id="0"
              >
                <h3 className="mb-2 text-xl">I want to…</h3>

                <ActionSelector
                  actions={actions}
                  onSelectedAction={actionCallback}
                />

                <selectedAction.Component />
              </section>

              <section
                className={clsx({
                  hidden: currentSectionIndex !== 1,
                })}
                id="1"
              >
                <CadenceBoundaryComponent />
              </section>

              <section
                className={clsx({
                  hidden: currentSectionIndex !== 2,
                })}
                id="2"
              >
                <RecipeSummaryComponent />
              </section>

              <section
                className={clsx({
                  hidden: currentSectionIndex !== 3,
                })}
                id="3"
              >
                <NetworkSignerComponent onComplete={nextSection} />
              </section>

              <section
                className={clsx({
                  hidden: currentSectionIndex !== 4,
                })}
                id="4"
              >
                <div className="text-center">
                  <CakeIcon className="mx-auto mb-4 w-24 text-gray-700" />

                  <h3 className="mb-2 text-xl">
                    {t('form.recipe_success_title')}
                  </h3>
                  <p className="text-gray-500">
                    {t('form.recipe_success_subtitle')}
                  </p>

                  {/* TODO: Add transaction links to explorers */}
                </div>

                <div className="my-12">
                  <a href="/profile/recipes">
                    <RecipeCardComponent
                      bgColor={successRecipeData.bgColor}
                      data={successRecipeData}
                    />
                  </a>
                </div>
              </section>

              <footer className="flex justify-between">
                <Button
                  className={clsx({
                    hidden:
                      currentSectionIndex === 0 || currentSectionIndex > 3,
                  })}
                  onClick={prevSection}
                  size="2xl"
                  variant="secondary"
                >
                  <span>Back</span>
                </Button>
                <Button
                  className={clsx({
                    hidden: currentSectionIndex > 1,
                    'ml-auto': true,
                  })}
                  onClick={nextSection}
                  size="2xl"
                  variant="primary"
                >
                  <span>Next</span>
                </Button>

                <Link href="/profile/recipes">
                  <Button
                    className={clsx({
                      hidden: currentSectionIndex < 4,
                      'mx-auto': true,
                    })}
                    size="2xl"
                    variant="secondary"
                  >
                    <span>View Recipes</span>
                  </Button>
                </Link>

                <div className="flex">
                  <SubmitButton
                    className={clsx({
                      hidden: currentSectionIndex !== 2,
                      'ml-auto': true,
                    })}
                    label="Confirm"
                    variant="primary"
                  />
                </div>
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
