# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 15 application that serves as an encrypted secret/environment file manager using blockchain infrastructure. Users authenticate via Privy (email-based with embedded wallet), encrypt secrets using Lit Protocol, and store them on-chain via the Keypo SDK.

### Tech Stack
- **Framework:** Next.js 15 (App Router) with React 19
- **Auth:** Privy (@privy-io/react-auth) - email-based auth with embedded wallets
- **Encryption:** Lit Protocol - handles encryption/decryption of secrets
- **Storage:** Keypo SDK (@keypo/typescript-sdk) - manages encrypted data on-chain
- **Chain:** Base Sepolia testnet
- **Account Abstraction:** ZeroDev SDK for gasless transactions
- **Styling:** Tailwind CSS with tailwindcss-animate

### Directory Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/app/api/` - API routes for Privy backend operations (getEmail, getWallets, preGenerate)
- `src/app/utils/` - Keypo SDK wrappers and configuration
- `src/components/` - React components (tabs, popups, auth providers)
- `public/refs.json` - Static configuration for contract addresses, API endpoints, chain config

### Key Patterns
- All components use `"use client"` directive (client-side rendering)
- Auth context provided via `PrivyWrapper` and `WalletClientProvider`
- Keypo SDK configs exported from `src/app/utils/key-types.ts` (encryptConfig, decryptConfig, deleteConfig, shareConfig)
- `src/app/utils/key-utils.ts` contains `getKeyDataByUser()` for fetching user's encrypted keys

### Core User Flows
1. **Upload Secrets** - Parse .env file, encrypt via Lit Protocol, store via Keypo
2. **Manage Secrets** - View, update, delete, or share encrypted data with other wallet addresses
3. **Use Secrets** - Retrieve secrets programmatically using Keypo SDK

### Environment Variables
Required variables are set in `.env` and `.env.development`. Key ones include:
- `NEXT_PUBLIC_PRIVY_APP_ID` - Privy app ID
- `PRIVY_APP_SECRET` - Privy backend secret (server-only)
- Contract addresses and API URLs are primarily configured in `public/refs.json`
