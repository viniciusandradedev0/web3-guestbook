# Deploy na Sepolia — Acompanhamento

Arquivo de acompanhamento do processo de tirar o projeto do local e colocar
"no ar" (contrato na Sepolia + frontend público). Vai sendo atualizado conforme
avançamos. Para o plano geral do projeto, ver [ROADMAP.md](./ROADMAP.md).

---

## Status atual

- [x] Ambiente local 100% funcional (Node 22 via `.nvmrc`, hardhat node + deploy
      local + frontend testados ponta a ponta — endereço determinístico
      `0x5FbDB2315678afecb367f032d93F642f64180aa3` confirmado)
- [x] Conta Alchemy criada + app Sepolia → `ALCHEMY_SEPOLIA_URL` configurada no `.env`
- [x] Carteira de teste gerada e `PRIVATE_KEY` configurada no `.env`
      (endereço: `0x9fbbd835bFB1f51Ee6d56DbEB6804d76493adac9`)
- [x] ETH de teste recebido em "Account 1" do MetaMask (`0xec91D2A97dD70fb2ff9C651775a1bfe6639D9411`,
      via Google Cloud Web3 Faucet) e 0.02 ETH transferidos para a carteira de deploy
- [x] **Deploy do contrato na Sepolia concluído** — endereço:
      [`0x9BfF3FE5220A94C876d8054294b4F38311E441EE`](https://sepolia.etherscan.io/address/0x9BfF3FE5220A94C876d8054294b4F38311E441EE)
- [x] `.env` atualizado: `VITE_CONTRACT_ADDRESS=0x9BfF3FE5220A94C876d8054294b4F38311E441EE`,
      `VITE_CHAIN_ID=11155111`
- [x] **Testado de ponta a ponta no navegador**: conectado na Sepolia (sem
      `NetworkBanner`), saldo exibido (2.76 ETH), assinatura enviada com sucesso
      e entrada apareceu na `EntryList` — confirmado também direto via RPC
      (`getEntryCount() == 1`, signer `0xec91D2A97dD70fb2ff9C651775a1bfe6639D9411`,
      nome "Vinicius", mensagem "Teste 01 - iniciando em desenvolvimento web3")
- [ ] Importar `0x9fbbd835bFB1f51Ee6d56DbEB6804d76493adac9` no MetaMask (opcional —
      só se quiser testar com essa conta também)
- [x] **Frontend publicado (Vercel)** — https://web3-guestbook-xi.vercel.app
      (env vars `VITE_CONTRACT_ADDRESS`, `VITE_CHAIN_ID=11155111` e
      `VITE_WALLETCONNECT_PROJECT_ID` configuradas em "Production and Preview",
      deploy com status "Ready")
- [x] README de portfólio com link da demo + link do contrato no Etherscan
      (adicionado em paralelo; falta só screenshot/GIF do app, que é opcional)

---

## Próximo passo imediato

🎉 **O projeto está 100% no ar**: contrato na Sepolia
([`0x9BfF3FE5220A94C876d8054294b4F38311E441EE`](https://sepolia.etherscan.io/address/0x9BfF3FE5220A94C876d8054294b4F38311E441EE))
+ frontend publicado na Vercel (https://web3-guestbook-xi.vercel.app).

O que resta são pequenos testes manuais do
[Plano de testes](#plano-de-testes-depois-do-deploy-na-sepolia) abaixo:

- **Seção 3** — trocar de rede na carteira (ex.: voltar pra Ethereum Mainnet) e
  confirmar que o `NetworkBanner` aparece com o botão de trocar para Sepolia.
- **Seção 6** — rejeitar uma transação no MetaMask (botão "Cancelar") e
  confirmar que aparece a mensagem amigável do `friendlyError()`, não o erro bruto.
- **Seção 4** — conferir que o link da transação abre a tx real no Etherscan Sepolia.

Depois desses testes, o essencial está concluído. Se quiser continuar
evoluindo o projeto, dá uma olhada na seção
[✨ Opcional do ROADMAP.md](./ROADMAP.md#-opcional--se-quiser-deixar-mais-redondo)
— nada ali é obrigatório.

---

## Plano de testes (depois do deploy na Sepolia)

### 1. Verificar o deploy
- [x] Conferir o endereço impresso pelo script de deploy
- [x] Confirmado via RPC que o contrato responde (`getEntryCount`, `getEntries`)

### 2. Testar leitura (sem gas)
- [x] Rodar `npm run dev` com `VITE_CONTRACT_ADDRESS` e `VITE_CHAIN_ID=11155111` atualizados
- [x] App abre e a `EntryList` carrega sem erros no console

### 3. Testar conexão de carteira
- [x] Conectar o MetaMask na rede **Sepolia**
- [x] `ConnectButton` mostra a conta certa e `NetworkBanner` não aparece (rede correta)
- [ ] Trocar para outra rede (ex.: Ethereum Mainnet) e confirmar que o `NetworkBanner`
      aparece com o botão de trocar para Sepolia

### 4. Testar escrita (transação real)
- [x] Preencher o `SignForm` (nome + mensagem) e enviar
- [x] Acompanhar os estados: aguardando carteira → confirmando → sucesso
- [x] Confirmar que a nova entrada aparece na `EntryList` após a confirmação
      (e validado on-chain via RPC)
- [ ] Conferir o link da transação no Etherscan (deve abrir a tx real na Sepolia)

### 5. Testar identidade (ENS)
- [x] Carteira de teste sem ENS — cai no fallback (endereço truncado `0xec91...9411`)
      sem erro, como esperado

### 6. Testar erro amigável
- [ ] Rejeitar uma transação no MetaMask (botão "Cancelar")
- [ ] Confirmar que aparece uma mensagem amigável (`friendlyError()`), não o erro bruto

---

## Depois do deploy: frontend público (Vercel)

- [x] Criar projeto na Vercel apontando para o repo do GitHub
      (`viniciusandradedev0/web3-guestbook`, branch `main`)
- [x] Configurar variáveis de ambiente na Vercel (apenas as `VITE_*` —
      `PRIVATE_KEY` e `ALCHEMY_SEPOLIA_URL` **nunca** vão para o hosting)
- [x] Validar o build de produção (`npm run build`) localmente antes do deploy
- [x] App publicado e no ar em https://web3-guestbook-xi.vercel.app (deploy
      com status "Ready"; testes restantes do plano acima podem ser feitos
      direto na URL pública)

---

## Continuando em outra máquina (notebook)

O arquivo `.env` está no `.gitignore` e **não foi commitado** — então ele só
existe na máquina onde foi criado. Para continuar o projeto em outro
computador (ex.: notebook), é preciso recriar o `.env` manualmente:

```bash
cp .env.example .env
```

E preencher pelo menos estas variáveis (são as que o frontend usa para
apontar para o contrato já deployado na Sepolia):

```env
VITE_CONTRACT_ADDRESS=0x9BfF3FE5220A94C876d8054294b4F38311E441EE
VITE_CHAIN_ID=11155111
VITE_WALLETCONNECT_PROJECT_ID=ce14d2d83134b7437981f470dc442410
```

> O `VITE_WALLETCONNECT_PROJECT_ID` acima é o Project ID real do Reown Cloud —
> é uma informação pública/client-side (não é segredo), então pode ser
> reaproveitado sem problema.

### E o `PRIVATE_KEY` / `ALCHEMY_SEPOLIA_URL`?

Essas duas variáveis só são necessárias se você for fazer um **novo deploy**
do contrato (`npx hardhat run scripts/deploy.ts --network sepolia`). Para
apenas rodar o frontend apontando para o contrato que já está no ar, elas
**não são necessárias** — podem ficar vazias/sem preencher no notebook, a
menos que você vá redeployar o contrato.

### E o `hardhat node`?

Para rodar `npm run dev` localmente apontando para a **Sepolia** (com as
envs acima), **não é preciso** ter o `npx hardhat node` rodando — isso é
necessário apenas para a rede local (`localhost`, chain id `31337`). Como o
`VITE_CHAIN_ID` está configurado para `11155111` (Sepolia), o frontend lê e
escreve direto na rede pública via RPC, sem precisar de nó local.
