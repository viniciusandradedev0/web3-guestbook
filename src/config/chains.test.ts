import { describe, it, expect } from 'vitest'
import { hardhat, sepolia } from 'wagmi/chains'
import { resolveTargetChain } from './chains'

describe('resolveTargetChain', () => {
  it('retorna sepolia para o id da sepolia (11155111)', () => {
    expect(resolveTargetChain(sepolia.id)).toBe(sepolia)
    expect(resolveTargetChain(11155111)).toBe(sepolia)
  })

  it('retorna hardhat para o id do hardhat (31337)', () => {
    expect(resolveTargetChain(hardhat.id)).toBe(hardhat)
    expect(resolveTargetChain(31337)).toBe(hardhat)
  })

  it('cai no default (hardhat) para um id desconhecido', () => {
    expect(resolveTargetChain(1)).toBe(hardhat)
  })

  it('cai no default (hardhat) para NaN (env ausente)', () => {
    expect(resolveTargetChain(NaN)).toBe(hardhat)
  })
})
