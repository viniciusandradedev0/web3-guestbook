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

## Backlog / Ideias futuras
- [ ] Reações/likes em entradas
- [ ] Edição/remoção da própria entrada (com restrição de tempo)
- [ ] Suporte a múltiplas redes (chain switcher)
- [ ] Indexação via The Graph para consultas mais ricas
- [ ] Upload de avatar/imagem (IPFS) junto com a mensagem
