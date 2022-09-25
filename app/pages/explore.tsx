import { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'react-i18next'

import { serverSideTranslations } from '@croncat-ui/i18n/serverSideTranslations'
import { RecipeCardComponent } from '@croncat-ui/ui'

import { PageHeader } from '@/components/PageHeader'

const ExplorePage: NextPage = () => {
  const { t } = useTranslation()

  const recipeData = [
    {
      title: 'Dollar Cost Average from $JUNO to $NETA',
      // subtitle: '',
      owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
      creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
      // recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
      // totalBalance: { amount: '10000000', denom: 'ujuno' },
      stats: {
        copycats: 139,
        runs: 1309,
      },
      actions: [],
      rules: [],
      networks: [],
      bgColor: '#F9226C',
    },
    {
      title: 'Automate Payroll, sending $JUNO to 2 or more accounts',
      // subtitle: '',
      owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
      creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
      // recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
      // totalBalance: { amount: '100000000', denom: 'ujuno' },
      stats: {
        copycats: 19,
        runs: 2847,
      },
      actions: [],
      rules: [],
      networks: [],
      bgColor: '#037099',
    },
    {
      title: 'Custom Message, flexible for developer automations',
      // subtitle: '',
      owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
      creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
      // recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
      // totalBalance: { amount: '1000000', denom: 'ujuno' },
      stats: {
        copycats: 6,
        runs: 204,
      },
      actions: [],
      rules: [],
      networks: [],
      bgColor: '#00787B',
    },
  ]

  return (
    <>
      <PageHeader title={t('title.explore')} />

      <div className="py-8 md:mx-auto md:max-w-6xl">
        <div className="grid grid-rows-3 gap-4 w-full md:grid-cols-3">
          {recipeData
            ? recipeData.map((recipe: any, index) => (
                <a key={index} href="/create">
                  <RecipeCardComponent bgColor={recipe.bgColor} data={recipe} />
                </a>
              ))
            : ''}
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
