import { describe, it, expect } from 'vitest'
import { BaseError, UserRejectedRequestError } from 'viem'
import { friendlyError } from './friendlyError'

describe('friendlyError', () => {
  it('retorna o shortMessage de um BaseError do viem', () => {
    const err = new BaseError('A mensagem curta.')
    expect(friendlyError(err)).toBe(err.shortMessage)
    expect(friendlyError(err)).toContain('A mensagem curta.')
  })

  it('retorna o shortMessage de um erro específico do viem (UserRejectedRequestError)', () => {
    const err = new UserRejectedRequestError(new Error('User rejected the request.'))
    expect(err).toBeInstanceOf(BaseError)
    expect(friendlyError(err)).toBe(err.shortMessage)
  })

  it('retorna .message de um Error genérico', () => {
    expect(friendlyError(new Error('falha genérica'))).toBe('falha genérica')
  })

  it('retorna a mensagem de fallback para uma string', () => {
    expect(friendlyError('algo')).toBe('Algo deu errado. Tente novamente.')
  })

  it('retorna a mensagem de fallback para null', () => {
    expect(friendlyError(null)).toBe('Algo deu errado. Tente novamente.')
  })

  it('retorna a mensagem de fallback para um objeto qualquer', () => {
    expect(friendlyError({ message: 'não é Error' })).toBe(
      'Algo deu errado. Tente novamente.',
    )
  })
})
