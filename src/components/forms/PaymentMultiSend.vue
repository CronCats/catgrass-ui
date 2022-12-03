<template>
  <div class="my-8">
    <Label class="mb-2" name="Sender Account" />
    <AccountSelector :onChange="pickFromAccount" :options="accounts" />

    <br />

    <h3 class="mb-2 text-xl">Recipients</h3>

    <div class="p-2 pb-0 -mx-2 mt-4 bg-gray-100 rounded-lg md:p-4 md:pb-0 md:-mx-4">
      <Label class="mb-2" name="Recipient address" />
      <AddressInput
        containerclass="grow bg-white"
        ref="addressRecipient"
        :onChange="changeAddress"
        :disabled="false"
        :error="errors?.recipient_address"
      />

      <br />

      <Label class="mb-2" name="Token amount sent each time" />
      <TokenInputSelector ref="tokenRecipient" :onChange="pickTokenInput" :options="availableTokens" />

      <Button @click="addRecipient" :active="true" class="mt-6 mb-4 btn-success" variant="primary">
        <PlusIcon class="w-4" />
        <span>Add Recipient</span>
      </Button>

      <div v-if="recipients.length > 0" class="p-2 -mx-2 mt-4 bg-white border-2 border-gray-100 rounded-lg md:p-4 md:-mx-4">
        <div class="overflow-x-auto">
          <table class="table w-full table-compact">
            <thead>
              <tr>
                <th></th>
                <th>Address</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, index) in recipients" :key="index">
                <th>{{index + 1}}</th>
                <td width="100%">{{r.address}}</td>
                <td>
                  <Balance :amount="r.balance.amount" :denom="r.balance.denom" :decimals="6" />
                </td>
                <td>
                  <div class="cursor-pointer opacity-50 hover:opacity-100" @click="removeRecipient(index)">
                    <TrashIcon class="w-4" />
                  </div>
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
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import type { Asset } from "@chain-registry/types";
import type { Addr, Account, Coin } from '@/utils/types'
import { getChainAssetList, getAssetByDenomOnChain, isCw20Asset, isNativeAsset } from '@/utils/helpers'
import { actionCatalog } from '@/utils/mvpData'
import Label from '../core/display/Label.vue'
import Balance from '../core/display/Balance.vue'
import Button from '../core/buttons/Button.vue'
import AccountSelector from '../core/inputs/AccountSelector.vue'
import AddressInput from '../core/inputs/AddressInput.vue'
import TokenInputSelector from '../core/inputs/TokenInputSelector.vue'
import NumberInput from '../core/inputs/NumberInput.vue'
import {
  PlusIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'

export default {
  components: {
    TrashIcon,
    PlusIcon,
    Label,
    Balance,
    Button,
    AccountSelector,
    AddressInput,
    TokenInputSelector,
    NumberInput,
  },

  data() {
    return {
      address: '',
      balance: { amount: 0, denom: '' } as Coin,
      recipients: [] as Account[],
      selectedAccount: null,
      selectedToken: null,
      availableTokens: [] as Asset[],
      errors: {},
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['accounts']),
    ...mapState(useTaskCreator, ['task', 'context']),
  },

  methods: {
    ...mapActions(useTaskCreator, ['updateTask', 'updateTaskContext']),
    pickFromAccount(account: Account) {
      this.selectedAccount = account
      this.availableTokens = getChainAssetList(account.chain)

      // signer account
      this.updateTaskContext({
        signer_addr: account.address,
      })
    },
    pickTokenInput(coin: Coin) {
      this.balance = coin
    },
    changeAddress(value: string) {
      this.address = value
    },
    addRecipient() {
      if (!this.address || !this.balance) return;
      const recipient = {
        address: this.address,
        balance: this.balance,
      }
      // push the action needed for payment
      const ctx = this.context
      let actions = ctx.actions || []
      const asset = getAssetByDenomOnChain(recipient.balance.denom, this.selectedAccount?.chain)
      if (!asset) return;

      if (isNativeAsset(asset)) actions.push(actionCatalog.getBankSend({
        to_address: recipient.address,
        amount: [recipient.balance],
      }))
      if (isCw20Asset(asset)) actions.push(actionCatalog.getCw20Send({
        contract_addr: asset.address || '',
        to_address: recipient.address,
        amount: `${recipient.balance.amount}`,
      }))
      this.updateTask({ actions })
      this.recipients.push(recipient)

      if (this.$refs.addressRecipient) this.$refs.addressRecipient.reset()
      if (this.$refs.tokenRecipient && this.$refs.tokenRecipient.reset) this.$refs.tokenRecipient.reset()
    },
    removeRecipient(idx: number) {
      this.recipients.splice(idx, 1)

      // remove the action as well
      let { actions } = this.context
      actions.splice(idx, 1)
      this.updateTask({ actions })
    },
  },

  mounted() {
    // init defaults
    this.selectedAccount = this.accounts[0]
    if (!this.selectedAccount || this.accounts.length <= 0) return []
    let acc = this.selectedAccount || this.accounts[0]
    if (!acc) return
    this.availableTokens = getChainAssetList(acc.chain)
    if (this.availableTokens) this.selectedToken = this.availableTokens[0]
  },
};
</script>
