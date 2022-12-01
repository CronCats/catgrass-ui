/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_CONFIG_NETWORK_TYPE: string
  readonly VITE_CONFIG_VERSION: string
  readonly VITE_CONTRACT_MANAGER_ARCHWAY: string
  readonly VITE_CONTRACT_MANAGER_JUNO: string
  readonly VITE_CONTRACT_MANAGER_QUASAR: string
  readonly VITE_CONTRACT_MANAGER_OSMOSIS: string
  readonly VITE_CONTRACT_MANAGER_NEUTRON: string
  readonly VITE_CONTRACT_MANAGER_SECRET: string
  readonly VITE_CONTRACT_MANAGER_STARGAZE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

