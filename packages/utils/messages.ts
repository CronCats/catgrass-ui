import {
  BankMsg,
  CosmosMsgFor_Empty,
  DistributionMsg,
  StakingMsg,
  WasmMsg,
} from '@croncat-ui/actions/types'

export function parseEncodedMessage(base64String?: string) {
  if (base64String) {
    const jsonMessage = decodeURIComponent(escape(atob(base64String)))
    if (jsonMessage) {
      return JSON.parse(jsonMessage)
    }
  }
  return undefined
}

export type WasmMsgType =
  | 'execute'
  | 'instantiate'
  | 'migrate'
  | 'update_admin'
  | 'clear_admin'

const WASM_TYPES: WasmMsgType[] = [
  'execute',
  'instantiate',
  'migrate',
  'update_admin',
  'clear_admin',
]

const BINARY_WASM_TYPES: { [key: string]: boolean } = {
  execute: true,
  instantiate: true,
  migrate: true,
}

export function isWasmMsg(msg?: CosmosMsgFor_Empty): msg is { wasm: WasmMsg } {
  if (msg) {
    return (msg as any).wasm !== undefined
  }
  return false
}

function getWasmMsgType(wasm: WasmMsg): WasmMsgType | undefined {
  for (const wasmType of WASM_TYPES) {
    if (!!(wasm as any)[wasmType]) {
      return wasmType
    }
  }
  return undefined
}

function isBinaryType(msgType?: WasmMsgType): boolean {
  if (msgType) {
    return !!BINARY_WASM_TYPES[msgType]
  }
  return false
}

// This function mutates its input message.
export const makeWasmMessage = (message: {
  wasm: any
}): {
  wasm: WasmMsg
} => {
  // We need to encode Wasm Execute, Instantiate, and Migrate messages.
  let msg = message
  if (message?.wasm?.execute) {
    msg.wasm.execute.msg = btoa(
      unescape(encodeURIComponent(JSON.stringify(message.wasm.execute.msg)))
    )
  } else if (message?.wasm?.instantiate) {
    msg.wasm.instantiate.msg = btoa(
      unescape(encodeURIComponent(JSON.stringify(message.wasm.instantiate.msg)))
    )
  } else if (message.wasm.migrate) {
    msg.wasm.migrate.msg = btoa(
      unescape(encodeURIComponent(JSON.stringify(message.wasm.migrate.msg)))
    )
  }
  // Messages such as update or clear admin pass through without modification.
  return msg
}

export const makeBankMessage = (
  amount: string,
  to: string,
  denom: string
): BankMsg => ({
  send: {
    amount: [
      {
        amount,
        denom,
      },
    ],
    to_address: to,
  },
})

export enum StakeType {
  Delegate = 'delegate',
  Undelegate = 'undelegate',
  Redelegate = 'redelegate',
  WithdrawDelegatorReward = 'withdraw_delegator_reward',
}

export const makeStakingMessage = (
  type: `${StakeType}`,
  amount: string,
  denom: string,
  validator: string,
  fromValidator?: string
): CosmosMsgFor_Empty => {
  const coin = {
    amount,
    denom,
  }

  let staking: StakingMsg
  switch (type) {
    case StakeType.Delegate:
      staking = {
        delegate: {
          amount: coin,
          validator,
        },
      }
      break
    case StakeType.Undelegate:
      staking = {
        undelegate: {
          amount: coin,
          validator,
        },
      }
      break
    case StakeType.Redelegate:
      if (!fromValidator) throw new Error('fromValidator not set')

      staking = {
        redelegate: {
          amount: coin,
          src_validator: fromValidator,
          dst_validator: validator,
        },
      }
      break
    default:
      throw new Error('Unexpected staking type')
  }

  return { staking }
}

export const makeDistributeMessage = (
  validator: string
): CosmosMsgFor_Empty => ({
  distribution: {
    withdraw_delegator_reward: {
      validator,
    },
  } as DistributionMsg,
})
