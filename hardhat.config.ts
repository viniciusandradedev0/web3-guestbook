import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import 'dotenv/config'

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '0x' + '0'.repeat(64)
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL ?? ''

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    sepolia: {
      url: ALCHEMY_SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    },
    hardhat: {},
  },
}

export default config
