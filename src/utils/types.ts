// eslint-disable-next-line regex/invalid
import type { Asset, Chain } from "@chain-registry/types";
import type { Addr, Coin } from "./contracts/cw-croncat-core/CwCroncatCore.types"
import * as core from "./contracts/cw-croncat-core/CwCroncatCore.types"
import * as rules from "./contracts/cw-rules-core/CwRulesCore.types"

export default { ...core, ...rules };

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
