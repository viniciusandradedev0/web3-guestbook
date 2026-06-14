import { useEnsAvatar, useEnsName } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { normalize } from 'viem/ens'

export function Identity({ address }: { address: `0x${string}` }) {
  const { data: ensName } = useEnsName({ address, chainId: mainnet.id })
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ? normalize(ensName) : undefined,
    chainId: mainnet.id,
  })

  const short = `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <span className="identity" title={address}>
      {ensAvatar ? (
        <img src={ensAvatar} alt="" className="identity-avatar" />
      ) : (
        <span className="identity-avatar identity-avatar--blank" aria-hidden />
      )}
      <span className="identity-label">{ensName ?? short}</span>
    </span>
  )
}
