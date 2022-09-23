// eslint-disable-next-line regex/invalid

import { Addr, Coin, CosmosMsgFor_Empty, Timestamp } from './types'

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
