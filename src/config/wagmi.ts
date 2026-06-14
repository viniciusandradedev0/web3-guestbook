import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { hardhat, sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Web3 Guestbook',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'placeholder',
  chains: [hardhat, sepolia],
  ssr: false,
})
