/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INFO_SERVER_HOST: string;
  // Near network
  readonly VITE_NEAR_NETWORK_ID: "testnet" | "mainnet";
  readonly VITE_NEAR_NODE_URL: string;
  readonly VITE_NEAR_WALLET_URL: string;
  readonly VITE_NEAR_HELPER_URL: string;
  readonly VITE_NEAR_EXPLORER_URL: string;
  // Contracts
  readonly VITE_APYS_CONTRACT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
