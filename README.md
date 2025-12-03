# 🌟 Web Crypto Wallet - Premium Edition ✨

A **production-grade**, fully-functional Web3 crypto wallet built with React, TypeScript, and ethers.js v6. This wallet works on real Ethereum testnets (Sepolia) and implements industry-standard security practices using the Web Crypto API.

**✨ NEW: Enhanced with 70+ animations, glassmorphism design, gradient themes, and enterprise-level UX!**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![ethers.js](https://img.shields.io/badge/ethers.js-6.9-blue)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-blueviolet)

## ⚠️ Important Disclaimer

**This wallet is for educational and testing purposes only.** Never use this wallet with real funds on Ethereum mainnet without a comprehensive professional security audit. Always test on testnets like Sepolia.

---

## ✨ Features

### 🎨 **NEW: Premium UI/UX** ⭐
- **70+ Smooth Animations**: Framer Motion-powered interactions
- **Glassmorphism Design**: Frosted glass effects with backdrop blur
- **Gradient Themes**: Beautiful color gradients throughout
- **Floating Elements**: Animated background blobs
- **Step Progress**: Visual progress indicators for multi-step flows
- **Password Strength**: Real-time animated strength meter
- **Confetti Celebrations**: Fun celebrations for wallet creation
- **Toast Notifications**: Beautiful gradient toast messages
- **Micro-interactions**: Hover effects, spring physics, smooth transitions
- **Card Animations**: Flip, scale, and stagger animations

### 🔑 Wallet Management
- **Create New Wallet**: Generate fresh 12 or 24-word mnemonic phrases
- **Import Wallet**: Import existing wallets via mnemonic phrase or private key
- **Secure Storage**: Encrypted storage using Web Crypto API (AES-256-GCM + PBKDF2)
- **Password Protection**: Unlock wallet with password-based encryption
- **MetaMask Integration**: Connect external MetaMask wallets

### 💰 Transactions
- **Send ETH**: Transfer Ethereum with EIP-1559 gas optimization
- **ERC-20 Tokens**: Full support for adding and transferring tokens
- **Gas Estimation**: Automatic gas estimation with safety buffer
- **Transaction History**: View past transactions with Etherscan links
- **Real-time Balance**: Auto-refreshing balance updates

### 🎨 User Interface
- **Modern Design**: Glassmorphism with gradient accents
- **Dark Mode**: Full dark mode support with smooth transitions
- **Mobile Responsive**: Works beautifully on all device sizes
- **Copy to Clipboard**: Easy address and data copying with animated feedback
- **Loading States**: Beautiful animated loading indicators
- **Smooth Transitions**: Page transitions and element animations

### 🔒 Security Features
- **AES-256-GCM Encryption**: Military-grade encryption for mnemonics
- **PBKDF2 Key Derivation**: 100,000 iterations for password security
- **No Plaintext Storage**: Secrets never stored in localStorage
- **IndexedDB**: Encrypted data stored securely in browser database
- **Password Validation**: Strong password requirements enforced
- **Security Warnings**: Clear warnings about mnemonic backup

---

## 📁 Project Structure

```
WebCryptoWallet/
├── src/
│   ├── components/           # React components
│   │   ├── MainLayout.tsx    # App layout with theme toggle
│   │   ├── WelcomeScreen.tsx # Initial screen for new users
│   │   ├── CreateWallet.tsx  # New wallet creation flow
│   │   ├── ImportWallet.tsx  # Import existing wallet
│   │   ├── UnlockScreen.tsx  # Password unlock screen
│   │   ├── Dashboard.tsx     # Main wallet dashboard
│   │   ├── WalletInfo.tsx    # Balance and address display
│   │   ├── SendETH.tsx       # ETH transfer component
│   │   ├── TokenManager.tsx  # ERC-20 token management
│   │   ├── TransactionHistory.tsx # Transaction list
│   │   ├── ConnectExternal.tsx    # MetaMask connection
│   │   └── LoadingSpinner.tsx     # Loading indicator
│   ├── context/              # React Context providers
│   │   ├── WalletContext.tsx # Global wallet state
│   │   └── ThemeContext.tsx  # Dark/light theme
│   ├── utils/                # Utility functions
│   │   ├── crypto.ts         # Web Crypto API encryption
│   │   ├── storage.ts        # IndexedDB operations
│   │   ├── ethereum.ts       # ethers.js helpers
│   │   └── erc20.ts          # ERC-20 ABI and types
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   ├── index.css             # Global styles
│   └── vite-env.d.ts         # TypeScript definitions
├── public/                   # Static assets
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Alchemy** or **Infura** account (for RPC access)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd WebCryptoWallet
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your RPC URL:
   ```env
   VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   VITE_NETWORK_NAME=Sepolia
   VITE_CHAIN_ID=11155111
   VITE_ETHERSCAN_URL=https://sepolia.etherscan.io
   ```

   **Get a free RPC URL**:
   - **Alchemy**: https://www.alchemy.com/
   - **Infura**: https://infura.io/

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**:
   ```
   http://localhost:3000
   ```

---

## 🧪 Testing Guide

### 1. Get Test ETH

Before testing, you need Sepolia testnet ETH. Use these faucets:

- **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
- **Infura Sepolia Faucet**: https://www.infura.io/faucet/sepolia
- **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia

### 2. Create a New Wallet

1. Click **"Create New Wallet"**
2. Enter a strong password (min 8 chars, uppercase, lowercase, number)
3. **IMPORTANT**: Write down your 12-word mnemonic phrase
4. Confirm you've saved it
5. Your wallet is created and unlocked!

### 3. Test Sending ETH

1. Copy your wallet address
2. Get test ETH from a faucet (see above)
3. Wait for confirmation (~15 seconds)
4. Go to **"Send"** tab
5. Enter recipient address and amount
6. Click **"Send ETH"**
7. View transaction on Etherscan

### 4. Test ERC-20 Tokens

**Example Test Token** (Sepolia):
```
Address: 0x779877A7B0D9E8603169DdbD7836e478b4624789
Name: ChainLink Token
Symbol: LINK
```

1. Go to **"Tokens"** tab
2. Enter token contract address
3. Click **"Add"**
4. Token balance appears
5. Click **"Send"** to transfer tokens

### 5. Test MetaMask Integration

1. Install MetaMask extension
2. Switch to Sepolia testnet in MetaMask
3. In wallet, go to **"Connect Wallet"**
4. Click **"Connect MetaMask"**
5. Approve connection in MetaMask popup

### 6. Test Import Wallet

1. Lock your wallet
2. Delete wallet from device
3. Click **"Import Wallet"**
4. Enter your mnemonic phrase
5. Set a new password
6. Wallet restored with same address!

---

## 🔧 Build & Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard:
   - `VITE_RPC_URL`
   - `VITE_NETWORK_NAME`
   - `VITE_CHAIN_ID`
   - `VITE_ETHERSCAN_URL`

4. **Redeploy** for changes to take effect:
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Set environment variables** in Netlify dashboard

### Deploy to GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/WebCryptoWallet"
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

---

## 🔐 Security Checklist

### ✅ Implemented Security Features

- [x] **AES-256-GCM encryption** for all sensitive data
- [x] **PBKDF2** with 100,000 iterations for key derivation
- [x] **Random salt and IV** for each encryption operation
- [x] **IndexedDB** instead of localStorage for storage
- [x] **No logging** of private keys or mnemonics
- [x] **Password validation** enforced (8+ chars, mixed case, numbers)
- [x] **HTTPS required** for production
- [x] **Security warnings** displayed prominently
- [x] **Mnemonic backup confirmation** required

### ⚠️ Security Considerations

1. **Browser Security**: 
   - Data is only as secure as the browser environment
   - Malicious browser extensions can access data
   - Use in private/incognito mode for added security

2. **Network Security**:
   - Always use HTTPS in production
   - RPC endpoints should be trusted
   - Consider using your own node for maximum security

3. **Password Security**:
   - Use a strong, unique password
   - Password is never transmitted or stored
   - Lost password = lost access (no recovery)

4. **Mnemonic Backup**:
   - Write down mnemonic phrase on paper
   - Store in secure location (safe, vault)
   - Never store digitally or in cloud
   - Never share with anyone

5. **Production Recommendations**:
   - Professional security audit required
   - Penetration testing recommended
   - Bug bounty program suggested
   - Regular security updates essential

---

## 🛠️ Technical Stack

### Core Technologies
- **React 18.2**: UI framework
- **TypeScript 5.2**: Type safety
- **Vite 5.0**: Build tool and dev server
- **ethers.js 6.9**: Ethereum library

### Styling
- **Tailwind CSS 3.3**: Utility-first CSS
- **lucide-react**: Icon library
- **Custom CSS**: Additional styling

### Storage & Crypto
- **idb 8.0**: IndexedDB wrapper
- **Web Crypto API**: Browser-native encryption
- **PBKDF2**: Password-based key derivation
- **AES-GCM**: Authenticated encryption

### Development
- **ESLint**: Code linting
- **TypeScript ESLint**: TypeScript-specific linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

---

## 📚 Key Implementation Details

### Encryption Flow

```typescript
// 1. User enters password
password = "MySecurePassword123"

// 2. Generate random salt and IV
salt = crypto.getRandomValues(16 bytes)
iv = crypto.getRandomValues(12 bytes)

// 3. Derive encryption key
key = PBKDF2(password, salt, 100000 iterations, SHA-256)

// 4. Encrypt mnemonic
ciphertext = AES-GCM-ENCRYPT(mnemonic, key, iv)

// 5. Store encrypted data
IndexedDB.save({
  ciphertext: base64(ciphertext),
  salt: base64(salt),
  iv: base64(iv)
})
```

### Transaction Flow

```typescript
// 1. User enters recipient and amount
to = "0x123..."
amount = "0.1 ETH"

// 2. Get current gas prices (EIP-1559)
{ maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData()

// 3. Build transaction
tx = {
  to,
  value: parseEther(amount),
  maxFeePerGas,
  maxPriorityFeePerGas
}

// 4. Sign and send
signedTx = await wallet.sendTransaction(tx)

// 5. Wait for confirmation
receipt = await signedTx.wait()
```

---

## 🐛 Troubleshooting

### Common Issues

**1. "RPC URL not configured" error**
- Solution: Add valid `VITE_RPC_URL` in `.env` file
- Get free API key from Alchemy or Infura

**2. "Failed to fetch balance" error**
- Solution: Check RPC URL is correct
- Ensure you're connected to internet
- Try a different RPC provider

**3. "Transaction failed" error**
- Solution: Check you have enough ETH for gas
- Verify recipient address is valid
- Ensure you're on correct network (Sepolia)

**4. Compilation errors after install**
- Solution: Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**5. Dark mode not working**
- Solution: Clear browser cache
- Check localStorage is enabled

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_RPC_URL` | Ethereum RPC endpoint | `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY` |
| `VITE_NETWORK_NAME` | Network display name | `Sepolia` |
| `VITE_CHAIN_ID` | Network chain ID | `11155111` |
| `VITE_ETHERSCAN_URL` | Block explorer URL | `https://sepolia.etherscan.io` |

---

## 🤝 Contributing

This is an educational project. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- **ethers.js** - Ethereum library
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool
- **React** - UI framework
- **Web Crypto API** - Browser encryption

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Read this README thoroughly

---

## 🎓 Learning Resources

### Ethereum Development
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [Ethereum.org Developer Docs](https://ethereum.org/en/developers/)
- [Sepolia Testnet Info](https://sepolia.dev/)

### Security
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [PBKDF2 Best Practices](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf)

---

**Built with ❤️ for the Ethereum community**

**Remember**: Never use this wallet with real funds without a professional security audit!
