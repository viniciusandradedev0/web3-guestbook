import { network } from 'hardhat'

async function main() {
  const { ethers } = await network.connect()

  const guestbook = await ethers.deployContract('Guestbook')
  await guestbook.waitForDeployment()

  const address = await guestbook.getAddress()
  console.log(`Guestbook deployed to: ${address}`)
  console.log(`\nAdicione no seu .env:`)
  console.log(`VITE_CONTRACT_ADDRESS=${address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
