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
    <span className="inline-flex max-w-full items-center gap-2" title={address}>
      {ensAvatar ? (
        <img
          src={ensAvatar}
          alt=""
          className="h-[22px] w-[22px] shrink-0 rounded-full border border-border bg-surface object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="h-[22px] w-[22px] shrink-0 rounded-full border border-primary/35 bg-gradient-to-br from-surface to-background shadow-[inset_0_0_0_1px_rgba(124,58,237,0.35)]"
        />
      )}
      <span className="overflow-hidden truncate font-mono text-sm text-primary">
        {ensName ?? short}
      </span>
    </span>
  )
}
