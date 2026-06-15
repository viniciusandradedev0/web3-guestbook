import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { GUESTBOOK_ADDRESS, GUESTBOOK_ABI } from '../config/contract'
import { friendlyError } from '../lib/friendlyError'

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

  const busy = isPending || isConfirming
  let buttonLabel = 'Assinar'
  if (isPending) buttonLabel = 'Aguardando carteira...'
  else if (isConfirming) buttonLabel = 'Confirmando na blockchain...'

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      className="glass-card mb-8 flex flex-col gap-4 p-5 sm:p-6"
    >
      <h2 className="text-base font-semibold tracking-tight text-text sm:text-lg">
        Assinar o livro de visitas
      </h2>

      <label className="flex flex-col gap-1.5 text-sm text-muted">
        Nome
        <input
          name="name"
          placeholder="Seu nome"
          required
          disabled={busy}
          className="rounded-lg border border-border bg-background/80 px-3 py-2.5 text-sm text-text placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-muted">
        Mensagem
        <textarea
          name="message"
          placeholder="Deixe uma mensagem..."
          required
          disabled={busy}
          rows={3}
          className="resize-y rounded-lg border border-border bg-background/80 px-3 py-2.5 font-sans text-sm text-text placeholder:text-muted/60 transition-colors focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        />
      </label>

      <motion.button
        type="submit"
        disabled={busy}
        whileHover={busy ? undefined : { scale: 1.02 }}
        whileTap={busy ? undefined : { scale: 0.98 }}
        className="self-start rounded-lg bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-[opacity,filter] enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
      >
        {buttonLabel}
      </motion.button>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="m-0 text-sm text-danger"
          >
            Erro: {friendlyError(error)}
          </motion.p>
        ) : isSuccess ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="m-0 text-sm text-success"
          >
            Assinatura registrada na blockchain!{' '}
            {txUrl && (
              <a
                href={txUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-1 whitespace-nowrap font-semibold underline decoration-success/40 hover:decoration-success"
              >
                Ver no explorer ↗
              </a>
            )}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.form>
  )
}
