import { expect } from 'chai'
import { network } from 'hardhat'

// Hardhat 3 + mocha-ethers: conectamos à rede dentro dos testes para obter
// uma instância isolada de `ethers` por suíte. Cada `deployContract` roda
// numa simulação EDR limpa, então não há estado compartilhado entre testes.

describe('Guestbook', () => {
  // Helper: deploya um Guestbook novo e devolve o contrato + os signers.
  async function deploy() {
    const { ethers } = await network.getOrCreate()
    const signers = await ethers.getSigners()
    const guestbook = await ethers.deployContract('Guestbook')
    return { ethers, guestbook, signers }
  }

  // Lê o timestamp do bloco em que uma transação foi minerada.
  // O contrato grava `block.timestamp`, então é assim que validamos o valor exato.
  async function blockTimestampOf(ethers: any, tx: any): Promise<bigint> {
    const receipt = await tx.wait()
    const block = await ethers.provider.getBlock(receipt.blockNumber)
    return BigInt(block!.timestamp)
  }

  describe('estado inicial', () => {
    it('getEntryCount() é 0 logo após o deploy', async () => {
      const { guestbook } = await deploy()
      expect(await guestbook.getEntryCount()).to.equal(0n)
    })

    it('getEntries() retorna array vazio logo após o deploy', async () => {
      const { guestbook } = await deploy()
      expect(await guestbook.getEntries()).to.deep.equal([])
    })
  })

  describe('sign()', () => {
    it('adiciona uma entrada com os campos corretos', async () => {
      const { ethers, guestbook, signers } = await deploy()
      const [owner] = signers

      const tx = await guestbook.sign('Alice', 'olá')
      const ts = await blockTimestampOf(ethers, tx)

      expect(await guestbook.getEntryCount()).to.equal(1n)

      const entries = await guestbook.getEntries()
      expect(entries.length).to.equal(1)

      const entry = entries[0]
      expect(entry.signer).to.equal(owner.address) // signer == msg.sender
      expect(entry.name).to.equal('Alice')
      expect(entry.message).to.equal('olá')
      expect(entry.timestamp).to.be.greaterThan(0n)
      expect(entry.timestamp).to.equal(ts) // == timestamp do bloco
    })

    it('emite o evento Signed com os args corretos', async () => {
      const { ethers, guestbook, signers } = await deploy()
      const [owner] = signers

      // Mineramos a tx primeiro para conhecer o timestamp exato do bloco e
      // poder validá-lo no evento com `withArgs`.
      const tx = await guestbook.sign('Bob', 'gm')
      const ts = await blockTimestampOf(ethers, tx)

      await expect(tx)
        .to.emit(guestbook, 'Signed')
        .withArgs(owner.address, 'Bob', 'gm', ts)
    })
  })

  describe('múltiplas entradas / múltiplos signers', () => {
    it('preserva ordem e associa cada entrada à conta que assinou', async () => {
      const { guestbook, signers } = await deploy()
      const [alice, bob] = signers

      await guestbook.connect(alice).sign('Alice', 'primeira')
      await guestbook.connect(bob).sign('Bob', 'segunda')

      expect(await guestbook.getEntryCount()).to.equal(2n)

      const entries = await guestbook.getEntries()

      // Ordem preservada: índice 0 = primeira assinatura.
      expect(entries[0].name).to.equal('Alice')
      expect(entries[0].message).to.equal('primeira')
      expect(entries[0].signer).to.equal(alice.address)

      expect(entries[1].name).to.equal('Bob')
      expect(entries[1].message).to.equal('segunda')
      expect(entries[1].signer).to.equal(bob.address)

      // Signers distintos de fato.
      expect(alice.address).to.not.equal(bob.address)
    })
  })

  describe('comportamento conhecido: sem validação de input', () => {
    it('aceita strings vazias sem reverter (o contrato não valida)', async () => {
      const { ethers, guestbook, signers } = await deploy()
      const [owner] = signers

      await expect(guestbook.sign('', '')).to.not.be.revert(ethers)

      expect(await guestbook.getEntryCount()).to.equal(1n)

      const entry = (await guestbook.getEntries())[0]
      expect(entry.name).to.equal('')
      expect(entry.message).to.equal('')
      expect(entry.signer).to.equal(owner.address)
    })
  })

  describe('round-trip de strings', () => {
    it('preserva unicode/emoji e strings longas sem corromper', async () => {
      const { guestbook } = await deploy()

      const name = 'José 🚀 Ωμέγα 日本語'
      const message = 'L'.repeat(1000) + ' — fim 🎉'

      await guestbook.sign(name, message)

      const entry = (await guestbook.getEntries())[0]
      expect(entry.name).to.equal(name)
      expect(entry.message).to.equal(message)
    })
  })
})
