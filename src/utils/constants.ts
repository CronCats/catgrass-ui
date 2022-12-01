export const appConfig = {
  title: import.meta.env.VITE_APP_TITLE || 'CronCat',
  networkType: import.meta.env.VITE_CONFIG_NETWORK_TYPE || 'testnet',
  version: import.meta.env.VITE_CONFIG_VERSION || '',
}

export const deployedContracts = {
  archway: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_ARCHWAY || '',
  },
  juno: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_JUNO || '',
  },
  quasar: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_QUASAR || '',
  },
  osmosis: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_OSMOSIS || '',
  },
  neutron: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_NEUTRON || '',
  },
  secret: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_SECRET || '',
  },
  stargaze: {
    manager: import.meta.env.VITE_CONTRACT_MANAGER_STARGAZE || '',
  },

  // NON-CosmWasm, but ICA
  cosmoshub: {
    manager: '',
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
