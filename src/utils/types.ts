// eslint-disable-next-line regex/invalid
import type { Asset, Chain } from "@chain-registry/types";
import type { Addr, Coin, BankMsg, Empty, StakingMsg, DistributionMsg, Binary, IbcMsg, WasmMsg, GovMsg } from "./contracts/cw-croncat-core/CwCroncatCore.types"
export * from "./contracts/cw-croncat-core/CwCroncatCore.types"
// import * as rules from "./contracts/cw-rules-core/CwRulesCore.types"

// export default { ...core, ...rules };

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
    stargate: {
      type_url: string
      value: Binary
    }
  }
  | {
    ibc: IbcMsg
  }
  | {
    wasm: WasmMsg
  }
  | {
    gov: GovMsg
  }
export type CosmosMsgForEmpty = CosmosMsgFor_Empty

export interface ChainMetadata {
  brandColor: string;
  asset?: Asset;
  chain?: Chain;
  accounts?: Account[];
  supported?: boolean;
}

export interface Account {
  title: string;
  address: Addr;
  balance: Coin;
  chain?: ChainMetadata;
  walletName?: string;
}

export interface AccountNetwork {
  accounts: Account[];
  network: ChainMetadata;
}
