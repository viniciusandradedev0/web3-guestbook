import { BaseError } from 'viem'

// Traduz um erro arbitrário (viem/wagmi ou genérico) numa mensagem amigável.
export function friendlyError(e: unknown): string {
  if (e instanceof BaseError) return e.shortMessage
  if (e instanceof Error) return e.message
  return 'Algo deu errado. Tente novamente.'
}
