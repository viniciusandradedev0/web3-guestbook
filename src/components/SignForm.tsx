import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { GUESTBOOK_ADDRESS, GUESTBOOK_ABI } from '../config/contract'

export function SignForm({ onSigned }: { onSigned: () => void }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const { writeContract, data: txHash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    writeContract(
      {
        address: GUESTBOOK_ADDRESS,
        abi: GUESTBOOK_ABI,
        functionName: 'sign',
        args: [name, message],
      },
      {
        onSuccess: () => {
          setName('')
          setMessage('')
          onSigned()
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="sign-form">
      <h2>Assinar o livro de visitas</h2>

      <label>
        Nome
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
          disabled={isPending || isConfirming}
        />
      </label>

      <label>
        Mensagem
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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

      {isSuccess && <p className="success">Assinatura registrada na blockchain!</p>}
      {error && <p className="error">Erro: {error.message}</p>}
    </form>
  )
}
