<template>
  <div class="my-8">
    <Label class="mb-2" name="From Account" />
    <AccountSelector :onChange="onChange" :options="accounts" />

    <br />

    <Label class="mb-2" name="Token" />
    <TokenSelector :onChange="onChange" :options="tokenOptions" />

    <!-- {/* <br />

    <Label class="mb-2" name={t('form.amount_total')} />
    <NumberInput
      // disabled={!isCreating}
      // error={errors?.amount}
      defaultValue={10}
      fieldName={fieldNamePrefix + 'amount_total'}
      onMinus={() =>
        setValue(
          fieldNamePrefix + 'amount_total',
          Math.max(
            Number(spendTotalAmount) - 1,
            1 / 10 ** amountDecimals
          ).toString()
        )
      }
      onPlus={() =>
        setValue(
          fieldNamePrefix + 'amount_total',
          Math.max(
            Number(spendTotalAmount) + 1,
            1 / 10 ** amountDecimals
          ).toString()
        )
      }
      register={register}
      sizing="full"
      step={1 / 10 ** amountDecimals}
      validation={[validateRequired, validatePositive]}
    /> */} -->

    <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />

    <h3 class="mb-2 text-xl">Recipients</h3>

    <div class="p-2 pb-0 -mx-2 mt-4 bg-gray-100 rounded-lg md:p-4 md:pb-0 md:-mx-4">
      <Label class="mb-2" name="Recipient address" />
      <AddressInput
        containerclass="grow bg-white"
        :disabled="false"
        :error="errors?.recipient_address"
      />

      <br />

      <Label class="mb-2" name="Amount to receive each time" />
      <NumberInput
        containerclass="bg-white"
        :defaultValue="1"
        onMinus="{() =>
          setValue(
            fieldNamePrefix + 'amount_to_receive',
            Math.max(
              Number(spendEachAmount) - 1,
              1 / 10 ** amountDecimals
            ).toString()
          )
        }"
        onPlus="{() =>
          setValue(
            fieldNamePrefix + 'amount_to_receive',
            Math.max(
              Number(spendEachAmount) + 1,
              1 / 10 ** amountDecimals
            ).toString()
          )
        }"
        sizing="full"
        :error="errors?.amount_to_receive"
      />

      <Button class="mt-6 btn-success" variant="primary">
        <PlusIcon class="w-4" />
        <span>Add Recipient</span>
      </Button>

      <div class="p-2 -mx-2 mt-8 bg-white border-2 border-gray-100 rounded-lg md:p-4 md:-mx-4">
        <div class="overflow-x-auto">
          <table class="table w-full table-compact">
            <thead>
              <tr>
                <th></th>
                <th>Address</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, index) in recipients" :key="index">
                <th>{{index + 1}}</th>
                <td>{{r.address}}</td>
                <td>
                  <Balance :amount="r.balance.amount" :denom="r.balance.denom" :decimals="6" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Asset, Chain } from '@chain-registry/types'
import { assets, chains } from 'chain-registry'
import { chainColors } from '@/utils/constants'
import { PlusIcon } from '@heroicons/vue/24/outline'
import Label from '../core/display/Label.vue'
import Balance from '../core/display/Balance.vue'
import Button from '../core/buttons/Button.vue'
import AccountSelector from '../core/inputs/AccountSelector.vue'
import AddressInput from '../core/inputs/AddressInput.vue'
import TokenSelector from '../core/inputs/TokenSelector.vue'
import NumberInput from '../core/inputs/NumberInput.vue'

const getChainData = (chain: Chain) => {
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
    key: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    value: {
      title: 'Dev Main Account',
      address: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
      balance: { amount: '13370000', denom: 'ujuno' },
      chain: supportedChains.find(({ chain_name }) => chain_name === 'juno'),
    },
  },
  {
    key: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    value: {
      title: 'Main Account 1',
      address: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
      balance: { amount: '420690000', denom: 'uosmo' },
      chain: supportedChains.find(
        ({ chain_name }) => chain_name === 'osmosis'
      ),
    },
  },
]

const recipients = [
  {
    address: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    balance: { amount: '13370000', denom: 'ujuno' },
  },
]

const assetList = assets.find(({ chain_name }) => chain_name === 'juno')
const tokens = assetList?.assets || []
const tokenOptions = tokens.map((token) => ({
  key: token.symbol,
  value: token,
}))

export default {
  // props: [""],

  components: {
    PlusIcon,
    Label,
    Balance,
    Button,
    AccountSelector,
    AddressInput,
    TokenSelector,
    NumberInput,
  },

  data() {
    return {
      accounts,
      recipients,
      tokenOptions,
      selectedToken: tokenOptions[0],
      errors: {},
    }
  },

  computed: {
    fn() {
      // 
    },
  },

  methods: {
    tokenCallback(token: any) {
      console.log('tokenCallback', token)
      this.selectedToken = token
    },
    onChange() {
      console.log('onChange')
    },
  },
};
</script>
