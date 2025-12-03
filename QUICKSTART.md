# 🚀 Quick Start Guide

Get the Web Crypto Wallet running in 5 minutes!

---

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- React & React DOM
- ethers.js v6
- Tailwind CSS
- TypeScript
- Vite
- All other dependencies

---

## Step 2: Configure RPC URL

### Get a Free RPC API Key

**Option A: Alchemy (Recommended)**
1. Go to https://www.alchemy.com/
2. Click "Sign Up"
3. Create account
4. Click "Create App"
5. Select "Ethereum" → "Sepolia"
6. Copy the HTTP URL

**Option B: Infura**
1. Go to https://infura.io/
2. Click "Sign Up"
3. Create account
4. Create new project
5. Select "Sepolia" network
6. Copy the HTTPS endpoint

### Add to `.env` File

Create/edit `.env` in project root:

```env
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY_HERE
VITE_NETWORK_NAME=Sepolia
VITE_CHAIN_ID=11155111
VITE_ETHERSCAN_URL=https://sepolia.etherscan.io
```

**Replace `YOUR_API_KEY_HERE` with your actual API key!**

---

## Step 3: Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

## Step 4: Open in Browser

Navigate to: **http://localhost:3000**

You should see the Welcome Screen!

---

## Step 5: Create Your First Wallet

1. Click **"Create New Wallet"**
2. Enter password: `Test1234` (or your own)
3. Click **"Create Wallet"**
4. **IMPORTANT**: Copy and save the 12-word mnemonic phrase
5. Check the confirmation box
6. Click **"I've Saved My Mnemonic"**

✅ Wallet created and unlocked!

---

## Step 6: Get Test ETH

1. Copy your wallet address (click copy icon)
2. Go to faucet: https://sepoliafaucet.com/
3. Paste your address
4. Request test ETH
5. Wait 15-30 seconds
6. Refresh balance in wallet

✅ You now have test ETH!

---

## Step 7: Send Your First Transaction

1. Click **"Send"** tab
2. Enter recipient: `0x0000000000000000000000000000000000000001`
3. Enter amount: `0.001`
4. Click **"Send ETH"**
5. Wait for confirmation
6. Click **"View on Etherscan"** to see transaction

✅ Transaction complete!

---

## Common Issues & Fixes

### "RPC URL not configured" Error

**Problem**: `.env` file not found or invalid API key

**Fix**:
```bash
# Make sure .env exists in project root
ls -la .env

# Check content
cat .env

# Verify API key is correct (no quotes needed)
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/abc123xyz
```

### "Cannot find module" Errors

**Problem**: Dependencies not installed

**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 Already in Use

**Problem**: Another app using port 3000

**Fix**:
```bash
# Option 1: Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill

# Option 2: Use different port
npm run dev -- --port 3001
```

### Changes Not Reflecting

**Problem**: Browser cache

**Fix**:
```bash
# Hard refresh
# Windows: Ctrl + Shift + R
# Mac: Cmd + Shift + R

# Or clear cache
# Chrome: DevTools > Application > Clear Storage
```

---

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

---

## Project Structure Overview

```
WebCryptoWallet/
├── src/
│   ├── components/       # UI components
│   ├── context/          # React Context (state)
│   ├── utils/            # Helper functions
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/               # Static files
├── .env                  # Your config (create this!)
├── package.json          # Dependencies
└── README.md             # Full documentation
```

---

## Next Steps

1. **Read Full Documentation**
   - `README.md` - Complete guide
   - `TESTING.md` - Testing scenarios
   - `SECURITY.md` - Security details

2. **Explore Features**
   - Try dark mode (moon icon)
   - Add ERC-20 tokens
   - View transaction history
   - Connect MetaMask

3. **Test Thoroughly**
   - Follow `TESTING.md` guide
   - Try all features
   - Test edge cases

4. **Customize**
   - Change theme colors in `tailwind.config.js`
   - Modify components in `src/components/`
   - Add new features!

---

## Getting Help

**Check Documentation**:
1. `README.md` - Main documentation
2. `TESTING.md` - Testing guide
3. `SECURITY.md` - Security info

**Common Questions**:
- Q: Can I use this on mainnet?
  - A: **NO!** Educational use only. Test on Sepolia only.

- Q: Where is my mnemonic stored?
  - A: Encrypted in browser IndexedDB

- Q: What if I forget my password?
  - A: You need your mnemonic to recover. No password recovery.

- Q: Is this safe for real money?
  - A: **NO!** This is for learning. Not audited. Use MetaMask for real funds.

---

## Quick Reference

**Sepolia Faucets**:
- https://sepoliafaucet.com/
- https://www.infura.io/faucet/sepolia

**Block Explorers**:
- https://sepolia.etherscan.io/

**RPC Providers**:
- https://www.alchemy.com/
- https://infura.io/

**Test ERC-20 Token**:
```
Address: 0x779877A7B0D9E8603169DdbD7836e478b4624789
Symbol: LINK
Network: Sepolia
```

---

## Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured with RPC URL
- [ ] Dev server running (`npm run dev`)
- [ ] Wallet created successfully
- [ ] Test ETH received from faucet
- [ ] First transaction sent
- [ ] Transaction visible on Etherscan

**All checked? You're ready to explore! 🎉**

---

**Remember**: This is for testing and education only. Never use with real funds!

For questions, check the full README.md or documentation files.
