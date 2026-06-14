import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReadContract } from 'wagmi'
import { GUESTBOOK_ADDRESS, GUESTBOOK_ABI } from '../config/contract'
import { Identity } from './Identity'

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

  if (isLoading) {
    return <p className="text-center text-sm text-muted sm:text-base">Carregando entradas...</p>
  }

  if (!entries || entries.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="px-4 py-8 text-center text-sm text-muted/70 sm:text-base"
      >
        Nenhuma entrada ainda. Seja o primeiro a assinar!
      </motion.p>
    )
  }

  const ordered = entries
    .map((entry, originalIndex) => ({ entry, originalIndex }))
    .reverse()

  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-muted sm:text-base">
        Entradas ({entries.length})
      </h2>
      <motion.ul
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="m-0 flex list-none flex-col gap-4 p-0"
      >
        <AnimatePresence initial={false}>
          {ordered.map(({ entry, originalIndex }: { entry: Entry; originalIndex: number }) => (
            <motion.li
              key={`${entry.signer}-${originalIndex}`}
              layout
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="glass-card p-4 sm:p-5"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <strong className="text-sm font-semibold text-text sm:text-base">
                  {entry.name}
                </strong>
                <Identity address={entry.signer} />
              </div>
              <p className="m-0 mb-3 text-sm leading-relaxed text-text/80 sm:text-base">
                {entry.message}
              </p>
              <time className="text-xs text-muted/60">
                {new Date(Number(entry.timestamp) * 1000).toLocaleString('pt-BR')}
              </time>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  )
}
