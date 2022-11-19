// eslint-disable-next-line regex/invalid
export type { Asset, AssetList, Chain } from '@chain-registry/types'

// NOTE: These need to be replaced by generated types. Hardcoded for MVP

export interface GenericBalance {
  native: Coin[]
  cw20: Coin[]
}

export enum AgentStatus {
  // Default for any new agent, if tasks ratio allows
  Active,

  // Default for any new agent, until more tasks come online
  Pending,

  // More tasks are available, agent must checkin to become active
  Nominated,
}

export interface Agent {
  // Where rewards get transferred
  payable_account_id: Addr

  // accrued reward balance
  balance: GenericBalance

  // stats
  total_tasks_executed: number

  // Holds slot number of a missed slot.
  // If other agents see an agent miss a slot, they store the missed slot number.
  // If agent does a task later, this number is reset to zero.
  // Example data: 1633890060000000000 or 0
  last_missed_slot: number

  // Timestamp of when agent first registered
  // Useful for rewarding agents for their patience while they are pending and operating service
  // Agent will be responsible to constantly monitor when it is their turn to join in active agent set (done as part of agent code loops)
  // Example data: 1633890060000000000 or 0
  register_start: Timestamp
}

export interface AgentResponse {
  // This field doesn't exist in the Agent struct and is the only one that differs
  status: AgentStatus
  payable_account_id: Addr
  balance: GenericBalance
  total_tasks_executed: number
  last_missed_slot: number
  register_start: Timestamp
}

/**
 * Cadence & Boundary Types
 */
export enum Interval {
  Once = 'once',
  Immediate = 'immediate',
  Block = 'block',
  Cron = 'cron',
}

export type BoundaryType = number | Timestamp

export type BoundaryRange =
  | {
    start?: number
    end?: number
  }
  | {
    start?: Timestamp
    end?: Timestamp
  }

export interface Action {
  // NOTE: Only allow static pre-defined query msg
  /// Supported CosmosMsgs only!
  msg: CosmosMsgFor_Empty

  /// The gas needed to safely process the execute msg
  gas_limit?: number
}

export interface Rule {
  /// TBD: Interchain query support (See ibc::IbcMsg)
  // pub chain_id: Option<String>,

  /// Account to direct all view calls against
  contract_addr: string

  // NOTE: Only allow static pre-defined query msg
  msg: string
}

// export type RuleResponse<T> = () => (arg0: boolean, arg1: T);

export interface Task {
  /// Entity responsible for this task, can change task details
  owner_id: Addr

  /// Scheduling definitions
  interval: Interval
  boundary: BoundaryRange
  funds_withdrawn_recurring: string

  /// Defines if this task can continue until balance runs out
  stop_on_fail: boolean

  /// NOTE: Only tally native balance here, manager can maintain token/balances outside of tasks
  total_deposit: GenericBalance

  amount_for_one_task: GenericBalance

  /// The cosmos message to call, if time or rules are met
  actions: Action[]
  /// A prioritized list of messages that can be chained decision matrix
  /// required to complete before task action
  /// Rules MUST return the ResolverResponse type
  rules?: Rule[]
  // TODO: funds! should we support funds being attached?
}


export interface ChainMetadata {
  brandColor: string
  asset?: Asset
  chain?: Chain
}

export interface Account {
  title: string
  address: Addr
  balance: Coin
  chain?: ChainMetadata
}

export interface AccountNetwork {
  accounts: Account[]
  network: ChainMetadata
}

/**
 * Duration is a delta of time. You can add it to a BlockInfo or Expiration to move that further in the future. Note that an height-based Duration and a time-based Expiration cannot be combined
 */
export type Duration =
  | {
      height: number
    }
  | {
      time: number
    }
/**
 * A thin wrapper around u128 that is using strings for JSON encoding/decoding, such that the full u128 range can be used for clients that convert JSON numbers to floats, like JavaScript and jq.
 *
 * # Examples
 *
 * Use `from` to create instances of this and `u128` to get the value out:
 *
 * ``` # use cosmwasm_std::Uint128; let a = Uint128::from(123u128); assert_eq!(a.u128(), 123);
 *
 * let b = Uint128::from(42u64); assert_eq!(b.u128(), 42);
 *
 * let c = Uint128::from(70u32); assert_eq!(c.u128(), 70); ```
 */
export type Uint128 = string
/**
 * This defines the different ways tallies can happen.
 *
 * The total_weight used for calculating success as well as the weights of each individual voter used in tallying should be snapshotted at the beginning of the block at which the proposal starts (this is likely the responsibility of a correct cw4 implementation). See also `ThresholdResponse` in the cw3 spec.
 */
export type Threshold =
  | {
      absolute_percentage: {
        percentage: Decimal
        [k: string]: unknown
      }
    }
  | {
      threshold_quorum: {
        quorum: Decimal
        threshold: Decimal
        [k: string]: unknown
      }
    }
/**
 * A fixed-point decimal value with 18 fractional digits, i.e. Decimal(1_000_000_000_000_000_000) == 1.0
 *
 * The greatest possible value that can be represented is 340282366920938463463.374607431768211455 (which is (2^128 - 1) / 10^18)
 */
export type Decimal = string
/**
 * A human readable address.
 *
 * In Cosmos, this is typically bech32 encoded. But for multi-chain smart contracts no assumptions should be made other than being UTF-8 encoded and of reasonable length.
 *
 * This type represents a validated address. It can be created in the following ways 1. Use `Addr::unchecked(input)` 2. Use `let checked: Addr = deps.api.addr_validate(input)?` 3. Use `let checked: Addr = deps.api.addr_humanize(canonical_addr)?` 4. Deserialize from JSON. This must only be done from JSON that was validated before such as a contract's state. `Addr` must not be used in messages sent by the user because this would result in unvalidated instances.
 *
 * This type is immutable. If you really need to mutate it (Really? Are you sure?), create a mutable copy using `let mut mutable = Addr::to_string()` and operate on that `String` instance.
 */
export type Addr = string
export interface Config {
  [k: string]: unknown
  description: string
  image_url?: string | null
  max_voting_period: Duration
  name: string
  proposal_deposit: Uint128
  refund_failed_proposals?: boolean | null
  threshold: Threshold
}
/**
 * Expiration represents a point in time when some event happens. It can compare with a BlockInfo and will return is_expired() == true once the condition is hit (and for every block in the future)
 */
export type Expiration =
  | {
      at_height: number
    }
  | {
      at_time: Timestamp
    }
  | {
      never: {
        [k: string]: unknown
      }
    }
/**
 * A point in time in nanosecond precision.
 *
 * This type can represent times from 1970-01-01T00:00:00Z to 2554-07-21T23:34:33Z.
 *
 * ## Examples
 *
 * ``` # use cosmwasm_std::Timestamp; let ts = Timestamp::from_nanos(1_000_000_202); assert_eq!(ts.nanos(), 1_000_000_202); assert_eq!(ts.seconds(), 1); assert_eq!(ts.subsec_nanos(), 202);
 *
 * let ts = ts.plus_seconds(2); assert_eq!(ts.nanos(), 3_000_000_202); assert_eq!(ts.seconds(), 3); assert_eq!(ts.subsec_nanos(), 202); ```
 */
export type Timestamp = Uint64
/**
 * A thin wrapper around u64 that is using strings for JSON encoding/decoding, such that the full u64 range can be used for clients that convert JSON numbers to floats, like JavaScript and jq.
 *
 * # Examples
 *
 * Use `from` to create instances of this and `u64` to get the value out:
 *
 * ``` # use cosmwasm_std::Uint64; let a = Uint64::from(42u64); assert_eq!(a.u64(), 42);
 *
 * let b = Uint64::from(70u32); assert_eq!(b.u64(), 70); ```
 */
export type Uint64 = string
export type CosmosMsgFor_Empty =
  | {
      bank: BankMsg
    }
  | {
      custom: Empty
    }
  | {
      staking: StakingMsg
    }
  | {
      distribution: DistributionMsg
    }
  | {
      wasm: WasmMsg
    }
/**
 * The message types of the bank module.
 *
 * See https://github.com/cosmos/cosmos-sdk/blob/v0.40.0/proto/cosmos/bank/v1beta1/tx.proto
 */
export type BankMsg =
  | {
      send: {
        amount: Coin[]
        to_address: string
        [k: string]: unknown
      }
    }
  | {
      burn: {
        amount: Coin[]
        [k: string]: unknown
      }
    }
/**
 * The message types of the staking module.
 *
 * See https://github.com/cosmos/cosmos-sdk/blob/v0.40.0/proto/cosmos/staking/v1beta1/tx.proto
 */
export type StakingMsg =
  | {
      delegate: {
        amount: Coin
        validator: string
        [k: string]: unknown
      }
    }
  | {
      undelegate: {
        amount: Coin
        validator: string
        [k: string]: unknown
      }
    }
  | {
      redelegate: {
        amount: Coin
        dst_validator: string
        src_validator: string
        [k: string]: unknown
      }
    }
/**
 * The message types of the distribution module.
 *
 * See https://github.com/cosmos/cosmos-sdk/blob/v0.42.4/proto/cosmos/distribution/v1beta1/tx.proto
 */
export type DistributionMsg =
  | {
      set_withdraw_address: {
        /**
         * The `withdraw_address`
         */
        address: string
        [k: string]: unknown
      }
    }
  | {
      withdraw_delegator_reward: {
        /**
         * The `validator_address`
         */
        validator: string
        [k: string]: unknown
      }
    }
/**
 * The message types of the wasm module.
 *
 * See https://github.com/CosmWasm/wasmd/blob/v0.14.0/x/wasm/internal/types/tx.proto
 */
export type WasmMsg =
  | {
      execute: {
        contract_addr: string
        funds: Coin[]
        /**
         * msg is the json-encoded ExecuteMsg struct (as raw Binary)
         */
        msg: Binary
        [k: string]: unknown
      }
    }
  | {
      instantiate: {
        admin?: string | null
        code_id: number
        funds: Coin[]
        /**
         * A human-readbale label for the contract
         */
        label: string
        /**
         * msg is the JSON-encoded InstantiateMsg struct (as raw Binary)
         */
        msg: Binary
        [k: string]: unknown
      }
    }
  | {
      migrate: {
        contract_addr: string
        /**
         * msg is the json-encoded MigrateMsg struct that will be passed to the new code
         */
        msg: Binary
        /**
         * the code_id of the new logic to place in the given contract
         */
        new_code_id: number
        [k: string]: unknown
      }
    }
  | {
      update_admin: {
        admin: string
        contract_addr: string
        [k: string]: unknown
      }
    }
  | {
      clear_admin: {
        contract_addr: string
        [k: string]: unknown
      }
    }
/**
 * Binary is a wrapper around Vec<u8> to add base64 de/serialization with serde. It also adds some helper methods to help encode inline.
 *
 * This is only needed as serde-json-{core,wasm} has a horrible encoding for Vec<u8>
 */
export type Binary = string

export interface Coin {
  [k: string]: unknown
  amount: Uint128
  denom: string
}
/**
 * An empty struct that serves as a placeholder in different places, such as contracts that don't set a custom message.
 *
 * It is designed to be expressable in correct JSON and JSON Schema but contains no meaningful data. Previously we used enums without cases, but those cannot represented as valid JSON Schema (https://github.com/CosmWasm/cosmwasm/issues/451)
 */
export interface Empty {
  [k: string]: unknown
}