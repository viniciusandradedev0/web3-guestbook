# Roadmap — Web3 Guestbook

**Objetivo do projeto:** aprender desenvolvimento **frontend web3** e ter um
projeto bacana, simples e *no ar* pra deixar no GitHub — mostrando na prática
que curto cripto/web3. Não é um produto de produção; é um portfólio honesto e
bem-acabado.

> Foco: **front polido + estar live + toques web3-nativos**. O contrato já faz
> o suficiente. O que vale pontos é a experiência e o projeto rodando de verdade.

---

## ▶️ Continue daqui (próximo passo principal)

**O projeto já está LIVE** 🎉 — contrato deployado na Sepolia
([`0x9BfF3FE5220A94C876d8054294b4F38311E441EE`](https://sepolia.etherscan.io/address/0x9BfF3FE5220A94C876d8054294b4F38311E441EE))
e frontend publicado na Vercel (https://web3-guestbook-xi.vercel.app).

O que falta agora é fechar os últimos testes manuais do
[Plano de testes em SEPOLIA_DEPLOY.md](./SEPOLIA_DEPLOY.md#plano-de-testes-depois-do-deploy-na-sepolia):
- Trocar de rede na carteira (ex.: voltar pra Ethereum Mainnet) e confirmar que o
  `NetworkBanner` aparece com o botão de trocar para Sepolia (seção 3).
- Rejeitar uma transação no MetaMask e confirmar que aparece a mensagem amigável
  do `friendlyError()`, não o erro bruto (seção 6).
- Conferir que o link da transação abre a tx real no Etherscan Sepolia (seção 4).

Depois disso, o essencial está concluído. Se quiser continuar evoluindo o
projeto, dá uma olhada na seção [✨ Opcional](#-opcional--se-quiser-deixar-mais-redondo)
— nada ali é obrigatório, é só pra deixar mais redondo.

---

## ✅ Já feito
- [x] Smart contract `Guestbook.sol` (`sign`, `getEntries`, `getEntryCount`, evento `Signed`)
- [x] Frontend React 19 + Vite + Tailwind 4
- [x] Conectar carteira (RainbowKit) + ler contrato + escrever transação com confirmação
- [x] Componentes `SignForm` e `EntryList`
- [x] Ambiente local funcionando (nó Hardhat + deploy + frontend lendo o contrato)
- [x] Migração para Hardhat 3 e correção do fallback do WalletConnect projectId
- [x] **Bugs P0 corrigidos:** refetch no `useEffect` (não no render) e atualização da
      lista amarrada à confirmação on-chain (form não-controlado via `FormData`)
- [x] **Contrato deployado na Sepolia** e testado de ponta a ponta no navegador
      (assinatura real, entrada na lista, confirmado também via RPC)
- [x] **Frontend publicado na Vercel**, com Project ID real do Reown Cloud para o
      WalletConnect — projeto 100% no ar em https://web3-guestbook-xi.vercel.app

---

## 🎯 Essencial — o que transforma isso num projeto de portfólio

Estes são os itens que mais valem a pena. Se fizer só esta seção, já é um
projeto redondo.

### 1. Toques "web3-nativos" no frontend
- [x] **ENS: nome + avatar** no lugar do endereço cru (componente `Identity`,
      `useEnsName` / `useEnsAvatar` resolvidos contra mainnet).
      *(Obs.: ENS só resolve em mainnet/Sepolia, não na rede local — endereços de
      teste do Hardhat caem no fallback de endereço truncado.)*
- [x] **Tratar rede errada:** componente `NetworkBanner` mostra aviso + botão
      "trocar de rede" quando a carteira não está na `targetChain` (`useSwitchChain`).
- [x] **Feedback de transação:** estados claros (aguardando carteira → confirmando
      → sucesso/erro) + link pro explorer da tx quando a rede tiver um.
      *(Opcional: trocar o feedback inline por toasts.)*
- [x] **Erros amigáveis:** `friendlyError()` usa `shortMessage` do viem (ex.:
      "User rejected the request.") em vez da mensagem crua.

### 2. Deixar o projeto LIVE (o diferencial nº 1) ✅ CONCLUÍDO

**Parte A — contrato na Sepolia**
- [x] Criar conta no **Alchemy** → copiar a URL HTTPS da app Sepolia para `ALCHEMY_SEPOLIA_URL` no `.env`
- [x] Carteira de DEV: garantir que `PRIVATE_KEY` no `.env` é de uma conta só pra teste
      (a conta #0 do Hardhat que está lá **não** tem ETH na Sepolia — usar uma carteira real de teste)
- [x] Pegar ETH de teste num **faucet Sepolia** (ex.: sepoliafaucet.com / faucet do Alchemy)
- [x] Deploy: `npx hardhat run scripts/deploy.ts --network sepolia`
- [x] Copiar o endereço impresso para `VITE_CONTRACT_ADDRESS` e setar `VITE_CHAIN_ID=11155111`
- [x] Contrato no ar em
      [`0x9BfF3FE5220A94C876d8054294b4F38311E441EE`](https://sepolia.etherscan.io/address/0x9BfF3FE5220A94C876d8054294b4F38311E441EE)
      (Sepolia Etherscan)

**Parte B — frontend na Vercel**
- [x] Criar projeto no **Reown Cloud** (ex-WalletConnect Cloud) → `VITE_WALLETCONNECT_PROJECT_ID`
      real configurado (`ce14d2d83134b7437981f470dc442410`)
- [x] Importar o repo na **Vercel** (framework Vite detectado automaticamente)
- [x] Configurar as envs na Vercel: `VITE_CONTRACT_ADDRESS`, `VITE_CHAIN_ID=11155111`,
      `VITE_WALLETCONNECT_PROJECT_ID` (em "Production and Preview")
- [x] Testar o fluxo completo na Sepolia com a MetaMask, já na URL pública
- [x] App publicado e funcionando em https://web3-guestbook-xi.vercel.app

> ⚠️ Cuidado de segurança: nunca commitar `.env` (já está no `.gitignore`). Na Vercel,
> só configure as variáveis `VITE_*` — a `PRIVATE_KEY` jamais deve ir para o hosting.

### 3. README de portfólio (a primeira coisa que olham)
- [ ] Screenshot ou GIF do app funcionando
- [x] Link da **demo ao vivo** (https://web3-guestbook-xi.vercel.app) + link do
      **contrato no Etherscan** (sendo adicionados ao README)
- [x] Stack usada e o que o projeto demonstra (connect wallet, read, write/tx)
- [x] Instruções de "como rodar localmente"

---

## ✨ Opcional — se quiser deixar mais redondo

Nada aqui é obrigatório; pegue conforme a vontade e o tempo.

- [ ] **Atualização ao vivo** via evento `Signed` (`useWatchContractEvent`):
      a assinatura de outra pessoa aparece sozinha, sem refresh.
- [ ] **Design caprichado** — hoje o visual está cru; um capricho de UI valoriza muito.
- [ ] **Responsivo (mobile)** e botão de copiar endereço/hash.
- [ ] **Validação no contrato:** rejeitar strings vazias e limitar tamanho de
      `name`/`message` (barato, evita spam) — espelhar `maxLength` no form.
- [ ] **Paginação** em `getEntries(offset, limit)` se a lista crescer muito.
- [ ] **Alguns testes** do contrato (Hardhat + chai): `sign` adiciona entrada,
      `getEntryCount` reflete o total, evento `Signed` é emitido. Bom pra mostrar
      que você sabe testar contrato.

---

## 💡 Ideias de futuro (fora do escopo atual)

Só anotações, caso um dia bata a vontade de evoluir. **Não precisa pra portfólio.**

- Reações/likes nas entradas
- Cada assinatura como NFT "soulbound" colecionável (prova de presença)
- Resolução de identidade além de ENS (login social / embedded wallet)
- Indexação com The Graph para busca/filtro mais ricos
- Suporte a múltiplas redes (chain switcher) e/ou uma L2 (Base/Arbitrum)

---

## 🛠️ Notas técnicas (importante no dia a dia)

- **Node:** o projeto exige **Node 22+** (Vite e Hardhat 3). Já existe um
  `.nvmrc` (= `22`) e `"engines": { "node": ">=22" }` no `package.json` — se o
  terminal abrir com uma versão diferente, ative a correta com:
  ```bash
  source ~/.nvm/nvm.sh && nvm use
  ```

- **Rodar local:** dois processos, ambos no Node 26, em terminais separados:
  | Terminal | Comando | O quê |
  |----------|---------|-------|
  | 1 | `npx hardhat node` | nó blockchain local (porta 8545) |
  | 2 | `npm run dev` | frontend Vite (porta 5173) |

- **Reiniciou o `hardhat node`?** A rede é em memória, o contrato some. Re-deploy:
  `npx hardhat run scripts/deploy.ts --network localhost` e confira se o
  `VITE_CONTRACT_ADDRESS` no `.env` bate com o novo endereço.
