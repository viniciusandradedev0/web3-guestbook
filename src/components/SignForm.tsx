import { useEffect, useRef } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { BaseError } from 'viem'
import { GUESTBOOK_ADDRESS, GUESTBOOK_ABI } from '../config/contract'

function friendlyError(e: unknown): string {
  if (e instanceof BaseError) return e.shortMessage
  if (e instanceof Error) return e.message
  return 'Algo deu errado. Tente novamente.'
}

export function SignForm({ onSigned }: { onSigned: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)

  const { chain } = useAccount()
  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const explorerUrl = chain?.blockExplorers?.default?.url
  const txUrl = txHash && explorerUrl ? `${explorerUrl}/tx/${txHash}` : undefined

  // Só após a confirmação on-chain limpamos o form e atualizamos a lista.
  // (o onSuccess do writeContract dispara no envio da tx, antes da entrada
  // existir na blockchain — e perderia a mensagem se o usuário rejeitasse.)
  useEffect(() => {
    if (isSuccess) {
      formRef.current?.reset()
      onSigned()
    }
  }, [isSuccess, onSigned])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '')
    const message = String(data.get('message') ?? '')

    writeContract({
      address: GUESTBOOK_ADDRESS,
      abi: GUESTBOOK_ABI,
      functionName: 'sign',
      args: [name, message],
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="sign-form">
      <h2>Assinar o livro de visitas</h2>

      <label>
        Nome
        <input
          name="name"
          placeholder="Seu nome"
          required
          disabled={isPending || isConfirming}
        />
      </label>

      <label>
        Mensagem
        <textarea
          name="message"
          placeholder="Deixe uma mensagem..."
          required
          disabled={isPending || isConfirming}
          rows={3}
        />
      </label>

      <button type="submit" disabled={isPending || isConfirming}>
        {isPending && 'Aguardando carteira...'}
        {isConfirming && 'Confirmando na blockchain...'}
        {!isPending && !isConfirming && 'Assinar'}
      </button>

      {isSuccess && (
        <p className="success">
          Assinatura registrada na blockchain!{' '}
          {txUrl && (
            <a href={txUrl} target="_blank" rel="noreferrer">
              Ver no explorer ↗
            </a>
          )}
        </p>
      )}
      {error && <p className="error">Erro: {friendlyError(error)}</p>}
    </form>
  )
}
