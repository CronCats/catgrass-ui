import { Chain } from '@chain-registry/types'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  InputLabel,
  RecipeCardComponent,
  SelectListOption,
} from '@croncat-ui/ui'
// import {
//   NATIVE_DECIMALS,
//   chainColors,
// } from '@croncat-ui/utils'

const formatInterval = (
  interval: SelectListOption,
  custom?: any,
  rule?: any
) => {
  if (!interval || !interval.key) return ''

  let s = ''

  switch (interval.key) {
    case 'cron_daily':
    case 'cron_hourly':
    case 'cron_minutely':
    case 'blocks_1000':
      s = interval.value.title
      break
    case 'balance_gt':
    case 'balance_lt':
      s = `${interval.value.title} ${rule.input} ${rule.select.toUpperCase()}`
      break
    case 'custom':
      if (custom && custom.select) {
        if (custom.select === 'block') s = `Every ${custom.input} blocks`
        if (custom.select === 'cron') s = `Cron Spec: "${custom.input}"`
      }
      break
    default:
      s = 'N/A'
  }

  return s
}

// Types:
// Timestamp: Return Humanized
// Block: Return CSV number
// Examples: 'When funds run out' | 'Tuesday, Oct 14th' | '5,134,948' | 'Immediately'
const formatBoundary = (boundary: SelectListOption, custom?: any) => {
  if (!boundary || !boundary.key) return ''

  let s = ''

  switch (boundary.key) {
    case 'immediate':
    case 'event_funds_lt':
      s = boundary.value.title
      break
    case 'cron_custom':
      const t = new Date(parseInt(custom))
      s = t.toLocaleString()
      break
    case 'blocks_custom':
      // TODO: support other locales
      s = `Block ${parseFloat(`${custom}`).toLocaleString('en-US')}`
      break
    default:
      s = 'N/A'
  }

  return s
}

export const RecipeSummaryComponent = () => {
  const { getValues } = useFormContext()
  const { t } = useTranslation()

  // TESTING:
  const [
    fromAccount,
    toAccount,
    fromToken,
    toToken,
    amountToSwap,
    interval,
    intervalCustom,
    ruleBalance,
    ruleBalanceAddress,
    boundaryStart,
    boundaryStartNumber,
    boundaryEnd,
    boundaryEndNumber,
  ] = getValues([
    'from_account',
    'to_account',
    'from_token',
    'to_token',
    'amount_to_swap_each',
    'interval',
    'interval_custom',
    'rule_balance',
    'rule_balance_address',
    'boundary_start',
    'cadence_start_number',
    'boundary_end',
    'cadence_end_number',
  ])

  // DEMO DATA
  const actions = [
    {
      Icon: ArrowPathRoundedSquareIcon,
      title: t('form.action_dca_title'),
      subtitle: t('form.action_dca_subtitle'),
    },
  ]

  const rules = []

  const schedule = {
    interval: formatInterval(interval, intervalCustom, ruleBalance),
    start: formatBoundary(boundaryStart, boundaryStartNumber),
    end: formatBoundary(boundaryEnd, boundaryEndNumber),
  }

  // TODO:
  const summary = {
    fees: '0.234913 JUNO', // gasWanted 380622, gasUsed 389326
    funds: '10 JUNO',
    // duration: '',
    occurances: '~10',
    // signatures: '',
  }

  let networks: Chain[] = []

  if (fromAccount?.value?.chain) networks.push(fromAccount.value.chain)
  // TODO: Filter dups?
  if (toAccount?.value?.chain) networks.push(toAccount.value.chain)

  const recipeData = {
    title: 'Dollar Cost Average from $JUNO to $NETA',
    // subtitle: '',
    owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
    creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
    // recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
    totalBalance: { amount: '10000000', denom: 'ujuno' },
    actions: [],
    rules: [],
    networks,
  }

  return (
    <div aria-details="dca fields" className="my-8">
      <h3 className="mb-8 text-xl">Confirm Details</h3>

      <RecipeCardComponent bgColor="#F9226C" data={recipeData} />

      <br />
      <br />

      {/* <InputLabel className="mb-2" name={t('form.actions')} />

      {actions.map((action: Action, id) => (
        <div key={id} className="p-2 text-gray-100 bg-gray-800 rounded-lg shadow-lg">
          <ActionItem action={action} />
        </div>
      ))}

      <br /> */}

      {rules.length > 0 ? (
        <div>
          <InputLabel className="mb-2" name={t('form.rules')} />

          <br />
        </div>
      ) : (
        ''
      )}

      <InputLabel className="mb-2" name={t('form.schedule')} />

      <div className="py-2 px-4 bg-white rounded-lg">
        {Object.keys(schedule).map((k: string, i) => {
          return (
            <div key={i} className="flex justify-between my-1 uppercase">
              <span>{k}</span>
              <span>{schedule[k as keyof typeof schedule]}</span>
            </div>
          )
        })}
      </div>

      <br />

      <InputLabel className="mb-2" name={t('form.summary')} />

      <div className="py-2 px-4 bg-white rounded-lg">
        {Object.keys(summary).map((k: string, i) => {
          return (
            <div key={i} className="flex justify-between my-1 uppercase">
              <span>{k}</span>
              <span>{summary[k as keyof typeof summary]}</span>
            </div>
          )
        })}
      </div>

      <br />
    </div>
  )
}
