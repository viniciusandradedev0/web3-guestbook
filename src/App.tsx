import { useCallback, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { SignForm } from './components/SignForm'
import { EntryList } from './components/EntryList'
import { NetworkBanner } from './components/NetworkBanner'
import './App.css'

function App() {
  const { isConnected } = useAccount()
  const [refetchSignal, setRefetchSignal] = useState(0)
  const handleSigned = useCallback(() => setRefetchSignal((s) => s + 1), [])

  return (
    <main className="container">
      <header>
        <div>
          <h1>Livro de Visitas</h1>
          <p>Deixe sua marca na blockchain</p>
        </div>
        <ConnectButton />
      </header>

      <NetworkBanner />

      {isConnected && (
        <SignForm onSigned={handleSigned} />
      )}

      {!isConnected && (
        <p className="connect-hint">Conecte sua carteira para assinar o livro.</p>
      )}

      <EntryList refetchSignal={refetchSignal} />
    </main>
  )
}

export default App
