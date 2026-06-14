import { useAccount, useSwitchChain } from 'wagmi'
import { targetChain } from '../config/chains'

export function NetworkBanner() {
  const { isConnected, chainId } = useAccount()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected || chainId === targetChain.id) {
    return null
  }

  return (
    <div className="network-banner">
      <span>
        Sua carteira está na rede errada. Troque para {targetChain.name} para
        continuar.
      </span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => switchChain({ chainId: targetChain.id })}
      >
        {isPending ? 'Trocando...' : `Trocar para ${targetChain.name}`}
      </button>
    </div>
  )
}
