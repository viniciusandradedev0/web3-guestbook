# Roadmap — Web3 Guestbook

**Objetivo do projeto:** aprender desenvolvimento **frontend web3** e ter um
projeto bacana, simples e *no ar* pra deixar no GitHub — mostrando na prática
que curto cripto/web3. Não é um produto de produção; é um portfólio honesto e
bem-acabado.

> Foco: **front polido + estar live + toques web3-nativos**. O contrato já faz
> o suficiente. O que vale pontos é a experiência e o projeto rodando de verdade.

---

## ▶️ Continue daqui (próximo passo principal)

**Deixar o projeto LIVE: deploy do contrato na Sepolia + frontend na Vercel.**
É o item de maior impacto pra portfólio — um link clicável onde qualquer pessoa
conecta a carteira e testa. Detalhes na seção [🎯 → 2. Deixar o projeto LIVE](#2-deixar-o-projeto-live-o-diferencial-n-1).

O bloco "web3-nativo" do frontend (ENS, rede errada, feedback de tx) já está
pronto. Falta só subir pro ar e escrever o README.

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

### 2. Deixar o projeto LIVE (o diferencial nº 1)

**Parte A — contrato na Sepolia** (precisa de Node 26: `source ~/.nvm/nvm.sh && nvm use 26`)
- [ ] Criar conta no **Alchemy** → copiar a URL HTTPS da app Sepolia para `ALCHEMY_SEPOLIA_URL` no `.env`
- [ ] Carteira de DEV: garantir que `PRIVATE_KEY` no `.env` é de uma conta só pra teste
      (a conta #0 do Hardhat que está lá **não** tem ETH na Sepolia — usar uma carteira real de teste)
- [ ] Pegar ETH de teste num **faucet Sepolia** (ex.: sepoliafaucet.com / faucet do Alchemy)
- [ ] Deploy: `npx hardhat run scripts/deploy.ts --network sepolia`
- [ ] Copiar o endereço impresso para `VITE_CONTRACT_ADDRESS` e setar `VITE_CHAIN_ID=11155111`
- [ ] (Opcional) Verificar o contrato no **Etherscan** Sepolia

**Parte B — frontend na Vercel**
- [ ] Criar projeto no **WalletConnect Cloud** → `VITE_WALLETCONNECT_PROJECT_ID`
      (sem isso real, o RainbowKit usa o fallback `placeholder` e o WalletConnect não funciona de verdade)
- [ ] Importar o repo na **Vercel** (framework Vite detectado automaticamente)
- [ ] Configurar as envs na Vercel: `VITE_CONTRACT_ADDRESS`, `VITE_CHAIN_ID=11155111`,
      `VITE_WALLETCONNECT_PROJECT_ID` (as `VITE_*` são as únicas que o front precisa;
      `PRIVATE_KEY`/`ALCHEMY_SEPOLIA_URL` são só de deploy, **não** vão pra Vercel)
- [ ] Testar o fluxo completo na Sepolia com a MetaMask, já na URL pública
- [ ] Pegar o link da demo + o link do contrato no Etherscan (vão pro README)

> ⚠️ Cuidado de segurança: nunca commitar `.env` (já está no `.gitignore`). Na Vercel,
> só configure as variáveis `VITE_*` — a `PRIVATE_KEY` jamais deve ir para o hosting.

### 3. README de portfólio (a primeira coisa que olham)
- [ ] Screenshot ou GIF do app funcionando
- [ ] Link da **demo ao vivo** + link do **contrato no Etherscan**
- [ ] Stack usada e o que o projeto demonstra (connect wallet, read, write/tx)
- [ ] Instruções de "como rodar localmente"

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

- **Node:** o projeto exige **Node 20.19+ / 22+** (Vite e Hardhat 3). O terminal
  abre com Node 18 do sistema → ative o Node 26 antes de qualquer comando:
  ```bash
  source ~/.nvm/nvm.sh && nvm use 26
  ```
  *(Recomendado fixar com um `.nvmrc` = `26` e `"engines": { "node": ">=22" }` no `package.json`.)*

- **Rodar local:** dois processos, ambos no Node 26, em terminais separados:
  | Terminal | Comando | O quê |
  |----------|---------|-------|
  | 1 | `npx hardhat node` | nó blockchain local (porta 8545) |
  | 2 | `npm run dev` | frontend Vite (porta 5173) |

- **Reiniciou o `hardhat node`?** A rede é em memória, o contrato some. Re-deploy:
  `npx hardhat run scripts/deploy.ts --network localhost` e confira se o
  `VITE_CONTRACT_ADDRESS` no `.env` bate com o novo endereço.
