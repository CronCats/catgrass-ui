import type { Addr, Coin, GenericBalance } from "@/utils/types"

// TODO: Setup msgs for diff networks - so i can filter/access based on authed wallet

// TODO: Change to dynamic
export const successRecipeData = {
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
};

export const getCosmosMsg = (msg: any, gas_limit?: number) => ({ msg, gas_limit, })

export const getWasmExecMsg = ({ contract_addr, msg, funds }: { contract_addr: Addr, msg: any, funds: Coin[] }) => {
  return getCosmosMsg({
    wasm: {
      execute: {
        contract_addr,
        // TODO: need binary transform
        msg,
        funds,
      }
    }
  })
}

// TODO: Remove someday :)
export const queriesCatalog = {
  hasBalanceGte({ contract_addr, address, required_balance }: { contract_addr: Addr, address: Addr, required_balance: GenericBalance }) {
    return getCosmosMsg({
      contract_addr,
      msg: {
        has_balance_gte: {
          address,
          required_balance,
        }
      }
    })
  },
  getNativeBalance({ contract_addr, address, denom }: { contract_addr: Addr, address: Addr, denom: string }) {
    return getCosmosMsg({
      contract_addr,
      msg: {
        get_balance: {
          address,
          denom,
        }
      }
    })
  },
  getCw20Balance({ contract_addr, cw20_contract, address }: { contract_addr: Addr, cw20_contract: Addr, address: Addr }) {
    return getCosmosMsg({
      contract_addr,
      msg: {
        get_cw20_balance: {
          cw20_contract,
          address,
        }
      }
    })
  },
}

// TODO: Remove someday :)
export const transformsCatalog = {}

// TODO: Remove someday :)
export const actionCatalog = {
  getBankSend({ to_address, amount }: { to_address: Addr, amount: Coin[] }) {
    return getCosmosMsg({
      bank: {
        send: {
          to_address,
          amount,
        }
      }
    })
  },
  getCw20Send({ contract_addr, to_address, amount }: { contract_addr: Addr, to_address: Addr, amount: string }) {
    return getWasmExecMsg({
      // cw20 address
      contract_addr,
      msg: {
        transfer: {
          recipient: to_address,
          amount
        }
      },
      funds: [],
    })
  },
  getStakingDelegation({ validator, amount }: { validator: Addr, amount: Coin }) {
    return {
      staking: {
        delegate: {
          validator,
          amount,
        }
      }
    }
  },
}
