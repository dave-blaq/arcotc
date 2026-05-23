# ArcOTC — Trustless P2P OTC Escrow on Arc

A non-custodial OTC trading escrow protocol built natively on [Arc testnet](https://arc.network) by Circle. USDC as gas, on-chain settlement, no middleman.

## The Problem

OTC trades on CT happen daily on pure trust — someone sends first and hopes the other side delivers. Rugs happen constantly. ArcOTC removes the trust requirement entirely by locking funds in a smart contract until both parties confirm.

## How It Works

1. Buyer calls `createTrade()` with seller address, amount, deadline, and description
2. Buyer approves USDC and calls `deposit()` — funds lock in contract
3. Seller delivers their side of the deal
4. Buyer calls `release()` — USDC goes to seller minus 0.5% protocol fee
5. If dispute arises, arbiter steps in to resolve
6. If deadline passes with no action, `expiredRefund()` returns funds to buyer automatically

## Contract Features

- **Multi-trade** — one contract handles unlimited simultaneous trades, each with a unique ID
- **Timelock** — every trade has a deadline, arbiter must act before expiry
- **Dispute system** — either party can flag a trade for arbiter review
- **Expired refund** — anyone can trigger a refund after deadline, no arbiter needed
- **Fee capture** — 0.5% deducted on every release, sent to protocol wallet automatically
- **Fully on-chain** — no backend, no custodian, every action verifiable on explorer

## Deployed Contracts (Arc Testnet)

| Contract | Address |
|---|---|
| ArcOTC v1 (multi-trade + fee capture) | `0x37530FaE4a39685738113138a84BC9e5a7270C7F` |
| Escrow v2 (timelock + random amounts) | `0x006F859ca97EcA0EFB3395568d032270b18ad85E` |

Explorer: [testnet.arcscan.app](https://testnet.arcscan.app)

Builder wallet: `0x30A29b88f86001ecb8ec9FB552a558b7eE56D9D0`

## Tech Stack

- **Smart contracts** — Solidity 0.8.20
- **Deploy tooling** — Hardhat 3 + ethers.js
- **Network** — Arc testnet (Chain ID: 5042002)
- **Gas token** — USDC (`0x3600000000000000000000000000000000000000`)

## Roadmap

- [x] Single escrow contract
- [x] Multi-trade architecture
- [x] Timelock + expired refund
- [x] Dispute system
- [x] Fee capture (0.5%)
- [ ] Telegram bot — OTC conversation layer
- [ ] Web wallet connect page — non-custodial user flow
- [ ] Arbiter dashboard
- [ ] Mainnet deployment

## Use Cases

- Token allocation OTC trades
- NFT peer-to-peer deals
- Whitelist spot sales
- Private round settlements
- Any P2P deal requiring trustless settlement

*Built on Arc. Settled on-chain. No trust required.*