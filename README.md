# Secrets Manager

A web application for managing encrypted secrets and environment files using blockchain infrastructure. Users authenticate via email, encrypt secrets using Lit Protocol, and store them on-chain via the Keypo SDK.

## Features

- **Upload Secrets** - Parse `.env` files, encrypt via Lit Protocol, and store on-chain
- **Manage Secrets** - View, update, delete, or share encrypted data with other users
- **Use Secrets** - Retrieve secrets programmatically using the Keypo CLI

## Tech Stack

- **Framework:** Next.js 15 (App Router) with React 19
- **Authentication:** [Privy](https://privy.io) - email-based auth with embedded wallets
- **Encryption:** [Lit Protocol](https://litprotocol.com) - decentralized encryption/decryption
- **Storage:** [Keypo SDK](https://keypo.io) - encrypted data management on-chain
- **Chain:** Base Sepolia testnet
- **Account Abstraction:** ZeroDev SDK for gasless transactions
- **Styling:** Tailwind CSS

## Prerequisites

- Node.js 18+
- npm or yarn
- A [Privy](https://dashboard.privy.io) account with an app configured
- A [ZeroDev](https://dashboard.zerodev.app) project with paymaster configured for Base Sepolia

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/keypo-us/secrets-manager.git
cd secrets-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_DATA_IDENTIFIER=your_data_identifier
NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS=0x8370eE1a51B5F31cc10E2f4d786Ff20198B10BBE
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_BUNDLER_RPC_URL=https://rpc.zerodev.app/api/v3/YOUR_ZERODEV_PROJECT_ID/chain/84532
NEXT_PUBLIC_VALIDATOR_CONTRACT_ADDRESS=0x35ADB6b999AbcD5C9CdF2262c7190C7b96ABcE4C
PRIVY_APP_SECRET=your_privy_app_secret
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Your Privy application ID from the Privy dashboard |
| `NEXT_PUBLIC_DATA_IDENTIFIER` | Unique identifier for your data namespace |
| `NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS` | Keypo registry contract on Base Sepolia |
| `NEXT_PUBLIC_API_URL` | Keypo API URL (use `https://api.keypo.io` for production) |
| `NEXT_PUBLIC_BUNDLER_RPC_URL` | ZeroDev bundler RPC URL with your project ID |
| `NEXT_PUBLIC_VALIDATOR_CONTRACT_ADDRESS` | Keypo validator contract address |
| `PRIVY_APP_SECRET` | Your Privy app secret (server-side only) |

### 4. Configure Privy Dashboard

Ensure your Privy app has the following settings enabled:

- **Login Methods:** Email
- **Embedded Wallets:** Enabled
- **User Pregeneration:** Enabled (required for sharing secrets with new users)

## Running the App

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm run start
```

## Using the Keypo CLI

After uploading secrets, you can retrieve them programmatically using the Keypo CLI.

### 1. Install the CLI

```bash
npm install -g @keypo/cli
```

### 2. Configure the CLI

```bash
keypo setup
```

This will prompt for:
- **Private Key:** Export from the app using "Export private key" button
- **RPC URL:** Use `https://sepolia.base.org`

### 3. Sync secrets to a file

Create an input file with placeholders using `${secret_name}` format:

```txt
# config.txt
API_KEY=${api_key}
DATABASE_URL=${database_url}
```

Run sync to replace placeholders with decrypted values:

```bash
keypo sync config.txt config-decrypted.txt
```

### 4. List your secrets

```bash
keypo list
```

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes for Privy backend operations
│   │   ├── getEmail/     # Get user email from wallet address
│   │   ├── getWallets/   # Get wallets for a Privy user
│   │   └── preGenerate/  # Pre-generate wallets for new users
│   ├── utils/            # Keypo SDK configuration and utilities
│   └── page.tsx          # Main application page
├── components/
│   ├── auth/             # Authentication components (Privy, wallet)
│   ├── popups/           # Modal dialogs (share, delete, update, etc.)
│   ├── UploadSecretsTab.tsx
│   ├── ManageSecretsTab.tsx
│   └── UseSecretsTab.tsx
└── public/
    └── refs.json         # Contract addresses and API configuration
```

## License

MIT
