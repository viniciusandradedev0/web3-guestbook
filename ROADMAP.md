# Roadmap — Web3 Guestbook

Lista de tarefas e fases do projeto, do estado atual até produção.

## Fase 0 — Base do projeto (concluído)
- [x] Smart contract `Guestbook.sol` (sign, getEntries, getEntryCount, evento Signed)
- [x] Scaffold do frontend (React 19 + Vite + Tailwind 4)
- [x] Configuração wagmi + RainbowKit (chains: hardhat, sepolia)
- [x] Componentes `SignForm` e `EntryList`
- [x] Script de deploy (`scripts/deploy.ts`)

## Fase 1 — Ambiente local (em andamento)
- [x] Criar `.env` a partir do `.env.example`
- [x] Subir nó Hardhat local (`npx hardhat node`)
- [x] Deploy do contrato na rede local e copiar endereço para `VITE_CONTRACT_ADDRESS`
- [x] Rodar o frontend (`npm run dev`) e validar que carrega e lê o contrato (`getEntryCount` = 0)
- [ ] Conectar MetaMask na rede Hardhat Local (ação manual no navegador)
- [ ] Testar fluxo completo: conectar carteira → assinar → ver entrada na lista
- [ ] Validar escrita (`sign`) com transação real via MetaMask

> Observação: Hardhat 3 requer Node 22+. O ambiente tem Node 18 (sistema) e Node 26 via nvm — usar Node 26 (`source ~/.nvm/nvm.sh && nvm use 26`) para comandos `hardhat`.

### Correções feitas nesta sessão
- `package.json`/`hardhat.config.ts`/`scripts/deploy.ts`: migrados para o formato do Hardhat 3 (estava com `hardhat-toolbox` v2 instalado junto do Hardhat 3, o que quebrava `npx hardhat node`). Agora usa `@nomicfoundation/hardhat-toolbox-mocha-ethers`, `defineConfig`, `configVariable` e `network.connect()`.
- `src/config/wagmi.ts`: corrigido fallback do `VITE_WALLETCONNECT_PROJECT_ID` (usava `??`, que não cobre string vazia, causando erro do RainbowKit "No projectId found").

## Dívida técnica — achados da revisão de código (2026-06-14)

Priorizados por severidade. Itens P0/P1 devem ser resolvidos **antes** do deploy na Sepolia.

### P0 — Bugs de correção
- [x] **`EntryList`: `refetch()` no corpo do render** (`src/components/EntryList.tsx`). Movido para `useEffect([refetchSignal, refetch])`.
- [x] **`SignForm`: sucesso sinalizado cedo demais** (`src/components/SignForm.tsx`). `onSigned()` agora é amarrado ao `isSuccess` do `useWaitForTransactionReceipt` (confirmação on-chain), não ao envio da tx. Form convertido para não-controlado (lê via `FormData`, limpa via `form.reset()`), evitando `setState` em efeito e preservando a mensagem caso o usuário rejeite a tx. `onSigned` estabilizado com `useCallback` em `App.tsx`.

### P1 — Escala e robustez
- [ ] **Contrato sem paginação** (`getEntries()` retorna array inteiro). Adicionar `getEntries(offset, limit)` e consumir com `getEntryCount()` no front. O retorno atual quebra (limite de gas/resposta RPC) conforme a lista cresce.
- [ ] **Contrato sem validação de input.** `require` de strings não-vazias e tamanho máximo de `name`/`message` (anti-spam e custo de storage). Espelhar `maxLength` nos inputs do `SignForm`.
- [ ] **`GUESTBOOK_ADDRESS` sem guarda** (`src/config/contract.ts`). O cast `as 0x...` mascara `undefined` quando a env falta. Fail-fast com mensagem clara na inicialização.
- [ ] **ABI mantida à mão** (`src/config/contract.ts`). Gerar tipos/ABI com **wagmi CLI** (`@wagmi/cli`) a partir do artifact compilado, eliminando o risco de divergência silenciosa contrato↔front.

### P2 — Qualidade e DX
- [ ] Atualização da lista **event-driven** com `useWatchContractEvent` no evento `Signed`, substituindo a prop `refetchSignal` (acopla App↔EntryList desnecessariamente).
- [ ] Trocar `scripts/deploy.ts` por um módulo do **Hardhat Ignition** (deploy idempotente + registro de endereço por rede em `ignition/deployments/`).
- [ ] Usar `key` estável na lista (ex.: `signer-timestamp`) em vez do índice do array.

## Fase 2 — Testes do contrato
- [ ] Criar suíte de testes (Hardhat + chai/viem) para `Guestbook.sol`
  - [ ] `sign` adiciona entrada corretamente (signer, name, message, timestamp)
  - [ ] `getEntries` retorna todas as entradas na ordem correta
  - [ ] `getEntryCount` reflete o número de assinaturas
  - [ ] Evento `Signed` é emitido com os parâmetros corretos
- [ ] Adicionar validações no contrato (ex: limitar tamanho de `name`/`message`, rejeitar strings vazias)
- [ ] Avaliar custo de gas e otimizações (ex: paginação de `getEntries` para listas grandes)

## Fase 3 — Melhorias de UX no frontend
- [ ] Estados de loading/erro mais claros no `SignForm` (idle → pending → confirming → success/error)
- [ ] Paginação ou scroll infinito na `EntryList` (evitar carregar array gigante de uma vez)
- [ ] Exibir nomes ENS / avatar quando disponível
- [ ] Mensagens de erro amigáveis (rejeição de transação, rede errada, etc.)
- [ ] Tema dark/light e responsividade mobile
- [ ] Feedback visual ao copiar endereço / hash da transação (link para o explorer)

## Fase 4 — Deploy na Sepolia testnet
- [ ] Criar conta no Alchemy e obter `ALCHEMY_SEPOLIA_URL`
- [ ] Criar projeto no WalletConnect Cloud e obter `VITE_WALLETCONNECT_PROJECT_ID`
- [ ] Obter ETH de teste via faucet Sepolia
- [ ] Deploy do contrato: `npx hardhat run scripts/deploy.ts --network sepolia`
- [ ] Atualizar `VITE_CONTRACT_ADDRESS` no `.env`
- [ ] Verificar contrato no Etherscan (Sepolia)
- [ ] Testar fluxo completo na Sepolia com MetaMask

## Fase 5 — Produção / Publicação
- [ ] Build de produção (`npm run build`) e revisão de bundle
- [ ] Deploy do frontend (Vercel/Netlify/GitHub Pages)
- [ ] Configurar variáveis de ambiente no provedor de hosting
- [ ] Revisão de segurança do contrato (entradas não confiáveis, limites de tamanho, custo de gas)
- [ ] Documentação final no README (endereço do contrato, link do app, instruções)
- [ ] (Opcional) Mainnet ou L2 (ex: Base, Arbitrum) — avaliar custo/benefício

## Fase 6 — Qualidade, automação e CI/CD
- [ ] GitHub Actions: pipeline com `lint` + `tsc` + testes do contrato em cada PR
- [ ] Cobertura de testes do contrato (`solidity-coverage` ou equivalente do toolbox)
- [ ] Análise estática do contrato (Slither) no CI
- [ ] Testes E2E do frontend (Playwright + carteira mock, ex.: Synpress/`@synthetixio`) cobrindo conectar → assinar → ver entrada
- [ ] Geração de ABI/tipos via `@wagmi/cli` integrada ao build (front sempre em sincronia com o contrato)
- [ ] Pre-commit hooks (lint-staged + husky) para formatar/lint antes do commit
- [ ] Dependabot/renovate para atualizações de dependências

## Fase 7 — Escala e indexação
- [ ] Migrar leituras pesadas para um indexer (The Graph subgraph ou Ponder) — consultas, ordenação e paginação fora da chain
- [ ] Cache/otimização das leituras no front (revalidação por evento + `staleTime` no react-query)
- [ ] Busca/filtro de entradas (por endereço, por texto) servidos pelo indexer
- [ ] Avaliar L2 (Base/Arbitrum/Optimism) para reduzir custo de escrita por assinatura

## Fase 8 — Recursos Web3 avançados (visão de produto)
- [ ] Identidade: resolução de ENS (nome + avatar) para o `signer` no lugar do endereço cru
- [ ] Onboarding sem fricção: login social/embedded wallet (ex.: Privy, Web3Auth) além de carteiras EOA
- [ ] Transações sem gas para o usuário: meta-transações ERC-2771 ou Account Abstraction (ERC-4337) com paymaster patrocinando a assinatura
- [ ] Anti-spam/sybil: rate-limit por endereço no contrato, taxa simbólica (pay-to-sign) revertida a um cofre, ou verificação de humanidade (gitcoin passport / proof-of-personhood)
- [ ] Moderação descentralizada: flag de entradas + ocultar no front sem apagar on-chain (censura mínima)
- [ ] Cada entrada como NFT (ERC-721) "soulbound" colecionável / prova de presença (POAP-like)
- [ ] Suporte multi-idioma (i18n) no frontend

## Fase 9 — Decisões de arquitetura de contrato (avaliar antes de mainnet)
- [ ] Upgradeabilidade: decidir entre contrato imutável (mais confiável/auditável) vs. proxy UUPS (evolutivo) — documentar o trade-off
- [ ] Padrão de eventos como fonte de verdade (UI lê de logs/indexer; storage só o necessário) para baratear gas
- [ ] Auditoria externa ou revisão por pares antes de qualquer deploy com valor real
- [ ] Bug bounty / disclosure policy se for para mainnet

## Backlog / Ideias futuras
- [ ] Reações/likes em entradas
- [ ] Edição/remoção da própria entrada (com restrição de tempo)
- [ ] Suporte a múltiplas redes (chain switcher) com registro de endereço por chain
- [ ] Upload de avatar/imagem (IPFS/Arweave) junto com a mensagem
- [ ] Compartilhamento social (preview/OG image gerada por entrada)
- [ ] Modo "mural" / visualização em grade das assinaturas
- [ ] Notificações (push/web3) quando alguém assina após você
