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
- [ ] Importar `0x9fbbd835bFB1f51Ee6d56DbEB6804d76493adac9` no MetaMask (opcional —
      só se quiser testar com essa conta também)
- [ ] Frontend publicado (Vercel)
- [ ] README de portfólio com link da demo + link do contrato no Etherscan

---

## Próximo passo imediato

Contrato no ar! Agora é seguir o **Plano de testes** abaixo: abrir o app
(`npm run dev`, já rodando em http://localhost:5173), conectar o MetaMask na
Sepolia com "Account 1" (`0xec91D2A97dD70fb2ff9C651775a1bfe6639D9411`, que tem
saldo) e testar o fluxo completo de assinatura.

---

## Plano de testes (depois do deploy na Sepolia)

### 1. Verificar o deploy
- Conferir o endereço impresso pelo script de deploy
- Abrir `https://sepolia.etherscan.io/address/<ENDEREÇO_DO_CONTRATO>` e confirmar
  que o contrato foi criado (transação de criação visível)

### 2. Testar leitura (sem gas)
- Rodar `npm run dev` com `VITE_CONTRACT_ADDRESS` e `VITE_CHAIN_ID=11155111` atualizados
- Abrir o app — a lista de entradas deve carregar (vazia, recém-deployado) sem erros no console

### 3. Testar conexão de carteira
- Conectar o MetaMask na rede **Sepolia** (rede já existe por padrão no MetaMask)
- Confirmar que o `ConnectButton` mostra a conta certa e que o `NetworkBanner`
  não aparece (rede correta)
- Trocar para outra rede (ex.: Ethereum Mainnet) e confirmar que o `NetworkBanner`
  aparece com o botão de trocar para Sepolia

### 4. Testar escrita (transação real)
- Preencher o `SignForm` (nome + mensagem) e enviar
- Acompanhar os estados: aguardando carteira → confirmando → sucesso
- Conferir o link da transação no Etherscan (deve abrir a tx real na Sepolia)
- Confirmar que a nova entrada aparece na `EntryList` após a confirmação

### 5. Testar identidade (ENS)
- Se a carteira de teste tiver ENS configurado, confirmar que aparece nome/avatar
  em vez do endereço truncado (componente `Identity`)
- Se não tiver ENS, confirmar que cai no fallback (endereço truncado) sem erro

### 6. Testar erro amigável
- Rejeitar uma transação no MetaMask (botão "Cancelar")
- Confirmar que aparece uma mensagem amigável (`friendlyError()`), não o erro bruto

---

## Depois do deploy: frontend público (Vercel)

- [ ] Criar projeto na Vercel apontando para o repo do GitHub
- [ ] Configurar variáveis de ambiente na Vercel (apenas as `VITE_*` —
      `PRIVATE_KEY` e `ALCHEMY_SEPOLIA_URL` **nunca** vão para o hosting)
- [ ] Validar o build de produção (`npm run build`) localmente antes do deploy
- [ ] Testar o app publicado (mesmo plano de testes acima, mas na URL pública)
