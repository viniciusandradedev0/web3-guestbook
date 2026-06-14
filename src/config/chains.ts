import { hardhat, sepolia } from 'wagmi/chains'

// Rede onde o contrato está implantado.
// Local = Hardhat (31337); live = Sepolia (11155111).
// Definida por VITE_CHAIN_ID no .env (default: Hardhat para dev local).
const configuredId = Number(import.meta.env.VITE_CHAIN_ID)

export const targetChain = configuredId === sepolia.id ? sepolia : hardhat
