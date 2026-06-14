import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { SignForm } from './components/SignForm'
import { EntryList } from './components/EntryList'
import { NetworkBanner } from './components/NetworkBanner'
import heroImage from './assets/hero.png'

function App() {
  const { isConnected } = useAccount()
  const [refetchSignal, setRefetchSignal] = useState(0)
  const handleSigned = useCallback(() => setRefetchSignal((s) => s + 1), [])

  return (
    <main className="relative mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <img
        src={heroImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -top-16 right-0 w-48 opacity-20 blur-sm sm:w-64 sm:opacity-25 md:w-80"
      />

      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 mb-8 flex flex-col items-center gap-4 text-center sm:mb-12 sm:flex-row sm:items-start sm:justify-between sm:text-left"
      >
        <div>
          <h1 className="bg-gradient-to-r from-primary via-fuchsia-400 to-accent bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Livro de Visitas
          </h1>
          <p className="mt-1.5 text-sm text-muted sm:text-base">
            Deixe sua marca na blockchain
          </p>
        </div>
        <div className="max-w-full">
          <ConnectButton />
        </div>
      </motion.header>

      <NetworkBanner />

      {isConnected && <SignForm onSigned={handleSigned} />}

      {!isConnected && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="my-6 text-center text-sm text-muted sm:text-base"
        >
          Conecte sua carteira para assinar o livro.
        </motion.p>
      )}

      <EntryList refetchSignal={refetchSignal} />
    </main>
  )
}

export default App
