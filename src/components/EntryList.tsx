import { useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { GUESTBOOK_ADDRESS, GUESTBOOK_ABI } from '../config/contract'

type Entry = {
  signer: `0x${string}`
  name: string
  message: string
  timestamp: bigint
}

export function EntryList({ refetchSignal }: { refetchSignal: number }) {
  const { data: entries, isLoading, refetch } = useReadContract({
    address: GUESTBOOK_ADDRESS,
    abi: GUESTBOOK_ABI,
    functionName: 'getEntries',
  })

  // Re-fetch quando refetchSignal muda (após uma nova assinatura confirmada)
  useEffect(() => {
    if (refetchSignal) refetch()
  }, [refetchSignal, refetch])

  if (isLoading) return <p>Carregando entradas...</p>

  if (!entries || entries.length === 0) {
    return <p className="empty">Nenhuma entrada ainda. Seja o primeiro a assinar!</p>
  }

  return (
    <section className="entry-list">
      <h2>Entradas ({entries.length})</h2>
      <ul>
        {[...entries].reverse().map((entry: Entry, i) => (
          <li key={i} className="entry-card">
            <div className="entry-header">
              <strong>{entry.name}</strong>
              <span className="entry-address">
                {entry.signer.slice(0, 6)}...{entry.signer.slice(-4)}
              </span>
            </div>
            <p>{entry.message}</p>
            <time>{new Date(Number(entry.timestamp) * 1000).toLocaleString('pt-BR')}</time>
          </li>
        ))}
      </ul>
    </section>
  )
}
