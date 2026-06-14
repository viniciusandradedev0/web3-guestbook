import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { hardhat, mainnet, sepolia } from 'wagmi/chains'

// mainnet entra só para resolver ENS (nome + avatar) — o contrato vive em
// hardhat (local) ou sepolia (live), conforme VITE_CHAIN_ID.
export const config = getDefaultConfig({
  appName: 'Web3 Guestbook',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'placeholder',
  chains: [hardhat, sepolia, mainnet],
  ssr: false,
})
