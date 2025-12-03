/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RPC_URL: string
  readonly VITE_ETHERSCAN_API_KEY: string
  readonly VITE_NETWORK_NAME: string
  readonly VITE_CHAIN_ID: string
  readonly VITE_ETHERSCAN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
