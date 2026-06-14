import { motion } from 'framer-motion'
import { useAccount, useSwitchChain } from 'wagmi'
import { targetChain } from '../config/chains'

export function NetworkBanner() {
  const { isConnected, chainId } = useAccount()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected || chainId === targetChain.id) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm leading-relaxed text-warning"
    >
      <span>
        Sua carteira está na rede errada. Troque para {targetChain.name} para
        continuar.
      </span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => switchChain({ chainId: targetChain.id })}
        className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors enabled:hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Trocando...' : `Trocar para ${targetChain.name}`}
      </button>
    </motion.div>
  )
}
