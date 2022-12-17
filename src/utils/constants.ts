export const appConfig = {
  title: import.meta.env.VITE_APP_TITLE || 'CronCat',
  networkType: import.meta.env.VITE_CONFIG_NETWORK_TYPE || 'testnet',
  version: import.meta.env.VITE_CONFIG_VERSION || '',
  gasLimitMultiplier: import.meta.env.VITE_CONFIG_GAS_MULTIPLIER || 1,
}

export const deployedContracts = {
  archway: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_ARCHWAY || '',
    rules: import.meta.env.VITE_CONTRACT_RULES_ARCHWAY || '',
  },
  juno: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_JUNO || '',
    rules: import.meta.env.VITE_CONTRACT_RULES_JUNO || '',
  },
  quasar: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_QUASAR || '',
    rules: import.meta.env.VITE_CONTRACT_RULES_QUASAR || '',
  },
  osmosis: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_OSMOSIS || '',
    rules: import.meta.env.VITE_CONTRACT_RULES_OSMOSIS || '',
  },
  neutron: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_NEUTRON || '',
    rules: import.meta.env.VITE_CONTRACT_RULES_NEUTRON || '',
  },
  secret: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_SECRET || '',
    rules: import.meta.env.VITE_CONTRACT_RULES_SECRET || '',
  },
  stargaze: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_STARGAZE || '',
    rules: import.meta.env.VITE_CONTRACT_RULES_STARGAZE || '',
  },

  // NON-CosmWasm, but ICA
  cosmoshub: {
    manager: '',
    rules: '',
  },
}

export const filteredChainNames = Object.keys(deployedContracts)
export const supportedChainNames = Object.keys(deployedContracts).filter(k => deployedContracts[k].manager.length > 0);
export const unsupportedChainNames = Object.keys(deployedContracts).filter(k => deployedContracts[k].manager.length <= 1);

// Lame hardcoding i know... in future, process image and find main theme
export const chainColors: Record<string, any> = {
  "archway": "#999",
  "cosmoshub": "#2E3148",
  "juno": "#F0827D",
  "quasar": "#999",
  "osmosis": "#4F01A8",
  "neutron": "#999",
  "secret": "#999",
  "stargaze": "#80D5C0",
};
