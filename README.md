# Web3 Guestbook

Um livro de visitas descentralizado na blockchain Ethereum. Qualquer pessoa com uma carteira cripto pode conectar e deixar seu nome e mensagem, registrados permanentemente na blockchain.

Projeto feito para aprender o stack moderno de frontend Web3: **wagmi**, **viem** e **RainbowKit**.

---

## Demo ao vivo

- **App:** [web3-guestbook-xi.vercel.app](https://web3-guestbook-xi.vercel.app) — conecte sua carteira na rede Sepolia e deixe sua mensagem
- **Contrato:** [0x9BfF3FE5220A94C876d8054294b4F38311E441EE no Etherscan (Sepolia)](https://sepolia.etherscan.io/address/0x9BfF3FE5220A94C876d8054294b4F38311E441EE)

> A leitura e visualização das mensagens funciona sem carteira. Para assinar o livro de visitas, é preciso ter MetaMask (ou outra carteira) configurada na rede Sepolia e com algum SepoliaETH de teste para pagar o gas.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Estilização | Tailwind CSS 4 |
| Conexão de Carteira | RainbowKit 2 |
| Hooks Ethereum | wagmi 2 + viem 2 |
| Smart Contract | Solidity 0.8.24 |
| Ambiente de Contrato | Hardhat 3 (requer Node 22) |
| Rede | Hardhat local / Sepolia testnet |

---

## Estrutura do Projeto

```
web3-guestbook/
├── contracts/
│   └── Guestbook.sol          # Smart contract principal
├── scripts/
│   └── deploy.ts              # Script de deploy com Hardhat
├── src/
│   ├── config/
│   │   ├── wagmi.ts           # Configuração de chains e providers
│   │   └── contract.ts        # ABI e endereço do contrato
│   ├── components/
│   │   ├── SignForm.tsx        # Formulário de assinatura (useWriteContract)
│   │   └── EntryList.tsx      # Lista de entradas (useReadContract)
│   ├── App.tsx                # Componente raiz
│   └── main.tsx               # Entry point com providers Web3
├── .env.example               # Variáveis de ambiente necessárias
└── hardhat.config.ts          # Configuração do Hardhat
```

---

## Conceitos Web3 Abordados

- **Carteiras e Conexão** — Como RainbowKit e wagmi gerenciam a conexão com MetaMask e outras carteiras
- **Leitura sem Gas** — `useReadContract` para chamar funções `view` do contrato (grátis)
- **Escrita com Transação** — `useWriteContract` para enviar transações que custam gas
- **Estados de Transação** — `idle → pending → confirming → success`
- **ABI** — O que é, por que o frontend precisa dele e como viem o usa para codificar chamadas
- **msg.sender** — Como o endereço do usuário fica registrado automaticamente no contrato
- **Eventos** — `event Signed` emitido a cada assinatura, rastreável na blockchain
- **Testnet vs Local** — Diferença entre Hardhat local (rápido, grátis) e Sepolia (rede real de testes)

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 22+ (para compilar o contrato com Hardhat 3)
- MetaMask instalado no navegador
- Contas no [Alchemy](https://alchemy.com) e na [Reown Cloud](https://cloud.reown.com) (cloud.reown.com, antigo WalletConnect Cloud)

> O frontend (Vite) funciona com Node 20+. Apenas o Hardhat requer Node 22. O
> projeto tem um `.nvmrc` com a versão 22 — se você usa [nvm](https://github.com/nvm-sh/nvm),
> rode `nvm use` na raiz do projeto para ativar a versão correta automaticamente.

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env`:

```env
# Chave privada da sua carteira de desenvolvimento (nunca use uma carteira com fundos reais)
PRIVATE_KEY=0x...

# URL RPC da Sepolia via Alchemy
ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/SUA_CHAVE

# Project ID do WalletConnect Cloud (obrigatório para o ConnectButton funcionar)
VITE_WALLETCONNECT_PROJECT_ID=seu_project_id

# Endereço do contrato (preenchido após o deploy)
VITE_CONTRACT_ADDRESS=0x...
```

### 3. Subir a blockchain local

```bash
npx hardhat node
```

Isso inicia um nó Ethereum local na porta 8545 com 20 contas de teste com 10000 ETH cada.

### 4. Fazer deploy do contrato

Em outro terminal:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Copie o endereço impresso e coloque no `.env` como `VITE_CONTRACT_ADDRESS`.

### 5. Rodar o frontend

```bash
npm run dev
```

### 6. Configurar MetaMask para a rede local

Adicione a rede Hardhat no MetaMask:
- **Nome:** Hardhat Local
- **RPC URL:** `http://127.0.0.1:8545`
- **Chain ID:** `31337`
- **Símbolo:** ETH

Importe uma das contas de teste usando a private key exibida no terminal do `hardhat node`.

---

## Deploy na Sepolia Testnet

> O contrato deste projeto já está deployado em produção na Sepolia, no endereço
> [`0x9BfF3FE5220A94C876d8054294b4F38311E441EE`](https://sepolia.etherscan.io/address/0x9BfF3FE5220A94C876d8054294b4F38311E441EE),
> e o frontend está publicado em [web3-guestbook-xi.vercel.app](https://web3-guestbook-xi.vercel.app).
> Os passos abaixo são para quem quiser fazer seu próprio deploy/fork do projeto.

1. Consiga ETH de teste no [Sepolia Faucet](https://sepoliafaucet.com)
2. Preencha `PRIVATE_KEY` e `ALCHEMY_SEPOLIA_URL` no `.env`
3. Execute:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

4. Atualize `VITE_CONTRACT_ADDRESS` no `.env` com o novo endereço
5. Rode o frontend e conecte no MetaMask apontando para Sepolia

---

## Smart Contract

```solidity
// contracts/Guestbook.sol

struct Entry {
    address signer;    // endereço de quem assinou (preenchido automaticamente)
    string name;       // nome informado
    string message;    // mensagem
    uint256 timestamp; // bloco de tempo
}

function sign(string calldata name, string calldata message) external
function getEntries() external view returns (Entry[] memory)
function getEntryCount() external view returns (uint256)
```

Evento emitido a cada assinatura:
```solidity
event Signed(address indexed signer, string name, string message, uint256 timestamp);
```
