# 🧪 Testing Guide - Web Crypto Wallet

Complete testing guide for all wallet features on Sepolia testnet.

---

## Pre-Testing Setup

### 1. Get Sepolia Test ETH

You'll need test ETH to perform transactions. Use these faucets:

**Primary Faucets:**
- **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
  - Requires Alchemy account
  - 0.5 Sepolia ETH per day
  
- **Infura Sepolia Faucet**: https://www.infura.io/faucet/sepolia
  - Requires Infura account
  - 0.5 Sepolia ETH per day

- **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia
  - No account required
  - Smaller amounts

**Alternative Faucets:**
- https://sepolia-faucet.pk910.de/ (PoW faucet)
- https://faucet.chainstack.com/sepolia-faucet

### 2. Prepare Test Data    

Save these for testing:

**Test ERC-20 Token (Sepolia LINK)**:
```
Contract: 0x779877A7B0D9E8603169DdbD7836e478b4624789
Name: ChainLink Token
Symbol: LINK
Decimals: 18
```
    
**Test Recipient Addresses**:
```
Address 1: 0x0000000000000000000000000000000000000001 (Burn address - for testing)
Address 2: Create a second wallet for real testing
```

---

## Test Scenarios

### Test 1: Create New Wallet

**Objective**: Verify wallet creation with encrypted storage

**Steps**:
1. Open application in browser
2. Click "Create New Wallet"
3. Enter password: `Test1234`
4. Confirm password: `Test1234`
5. Click "Create Wallet"

**Expected Results**:
- ✅ Mnemonic phrase displayed (12 words)
- ✅ Security warning shown
- ✅ Words are readable and copyable
- ✅ Cannot proceed without confirming backup

**Steps (continued)**:
6. Copy mnemonic to notepad (SAVE IT!)
7. Check "I have written down my mnemonic"
8. Click "I've Saved My Mnemonic"

**Expected Results**:
- ✅ Wallet unlocked automatically
- ✅ Address displayed (starts with 0x)
- ✅ Balance shows 0.0000 ETH
- ✅ Network shows "Sepolia"

---

### Test 2: Lock and Unlock Wallet

**Objective**: Verify password-based encryption/decryption

**Steps**:
1. From unlocked wallet, click "Lock Wallet"
2. Verify screen shows unlock prompt
3. Enter wrong password: `WrongPass123`
4. Click "Unlock Wallet"

**Expected Results**:
- ✅ Error message: "Failed to unlock wallet. Wrong password?"
- ✅ Wallet remains locked

**Steps (continued)**:
5. Enter correct password: `Test1234`
6. Click "Unlock Wallet"

**Expected Results**:
- ✅ Wallet unlocks successfully
- ✅ Same address displayed as before
- ✅ Balance refreshes

---

### Test 3: Import Wallet from Mnemonic

**Objective**: Verify mnemonic import functionality

**Steps**:
1. Lock current wallet
2. Click "Delete Wallet from This Device"
3. Confirm deletion
4. Click "Import Wallet"
5. Select "Mnemonic Phrase" tab
6. Enter saved mnemonic from Test 1
7. Enter new password: `NewPass1234`
8. Confirm password: `NewPass1234`
9. Click "Import Wallet"

**Expected Results**:
- ✅ Wallet imported successfully
- ✅ **SAME ADDRESS** as original wallet
- ✅ Balance preserved
- ✅ Can unlock with new password

---

### Test 4: Receive ETH

**Objective**: Verify receiving functionality

**Steps**:
1. Copy wallet address (click copy icon)
2. Go to Sepolia faucet
3. Paste address
4. Request test ETH
5. Wait 15-30 seconds
6. Click refresh icon on balance

**Expected Results**:
- ✅ Balance updates to show received ETH
- ✅ Amount matches faucet amount (~0.5 ETH)
- ✅ Can view address on Etherscan

---

### Test 5: Send ETH

**Objective**: Verify ETH transfer with gas estimation

**Steps**:
1. Navigate to "Send" tab
2. Enter recipient: `0x0000000000000000000000000000000000000001`
3. Enter amount: `0.001`
4. Wait 2 seconds for gas estimation

**Expected Results**:
- ✅ Estimated gas displays (e.g., "0.0001 ETH")
- ✅ Send button enabled

**Steps (continued)**:
5. Click "Send ETH"
6. Wait for transaction confirmation

**Expected Results**:
- ✅ "Transaction sent!" message appears
- ✅ Transaction hash displayed
- ✅ "View on Etherscan" link works
- ✅ Transaction shows on Etherscan
- ✅ Balance decreases by (amount + gas)
- ✅ Transaction appears in History tab

---

### Test 6: Add ERC-20 Token

**Objective**: Verify ERC-20 token support

**Steps**:
1. Navigate to "Tokens" tab
2. Enter token address: `0x779877A7B0D9E8603169DdbD7836e478b4624789`
3. Click "Add"

**Expected Results**:
- ✅ Loading spinner appears
- ✅ Token added successfully
- ✅ Token info displayed:
  - Name: ChainLink Token
  - Symbol: LINK
  - Balance: 0 LINK (initially)

---

### Test 7: Request Test Tokens

**Objective**: Get test ERC-20 tokens for transfer testing

**Note**: Getting test ERC-20 tokens can be challenging. Options:

**Option A: Use a DEX on Sepolia**
1. Go to Uniswap testnet
2. Swap some ETH for test tokens

**Option B: Find a token faucet**
- Search for "Sepolia token faucet"
- Some projects offer test tokens

**Option C: Deploy your own test token** (Advanced)
- Use Remix IDE
- Deploy simple ERC-20 contract
- Mint tokens to yourself

---

### Test 8: Send ERC-20 Token

**Objective**: Verify token transfer (requires tokens from Test 7)

**Steps** (only if you have tokens):
1. In Tokens tab, find your token
2. Click "Send" button
3. Enter recipient address
4. Enter amount
5. Click "Send"

**Expected Results**:
- ✅ Transaction sent successfully
- ✅ Token balance updates
- ✅ Transaction viewable on Etherscan

---

### Test 9: Transaction History

**Objective**: Verify transaction history display

**Steps**:
1. Navigate to "History" tab
2. Click refresh icon

**Expected Results**:
- ✅ Previous transactions listed
- ✅ Shows sent/received indicator
- ✅ Shows amount and timestamp
- ✅ Hash displayed (truncated)
- ✅ "View on Etherscan" links work
- ✅ Correct color coding (red=sent, green=received)

**Note**: Due to RPC limitations, some transactions may not appear. This is normal for free RPC endpoints.

---

### Test 10: Connect MetaMask

**Objective**: Verify external wallet connection

**Prerequisites**:
- MetaMask extension installed
- MetaMask configured for Sepolia network

**Steps**:
1. Lock internal wallet (or delete it)
2. Click "Connect Wallet" on welcome screen
3. Click "Connect MetaMask"
4. Approve connection in MetaMask popup

**Expected Results**:
- ✅ Connection successful
- ✅ MetaMask address displayed
- ✅ Balance fetched from MetaMask account
- ✅ "MetaMask" badge shown
- ✅ Can perform transactions (uses MetaMask to sign)

---

### Test 11: Dark Mode

**Objective**: Verify theme persistence

**Steps**:
1. Click moon/sun icon in header
2. Verify dark mode activates
3. Refresh page
4. Click icon again

**Expected Results**:
- ✅ Theme toggles smoothly
- ✅ All components render correctly in both themes
- ✅ Theme persists after refresh
- ✅ No visual glitches

---

### Test 12: Error Handling

**Objective**: Verify proper error handling

**Test Invalid Address**:
1. Go to Send tab
2. Enter invalid address: `0x123`
3. Enter amount: `0.1`
4. Click Send

**Expected Results**:
- ✅ Error: "Invalid recipient address"

**Test Insufficient Balance**:
1. Enter valid address
2. Enter amount greater than balance
3. Click Send

**Expected Results**:
- ✅ Transaction fails with clear error message

**Test Invalid Token Address**:
1. Go to Tokens tab
2. Enter: `0x0000000000000000000000000000000000000000`
3. Click Add

**Expected Results**:
- ✅ Error message displayed
- ✅ Token not added

---

### Test 13: Copy Functionality

**Objective**: Verify clipboard operations

**Steps**:
1. Click copy icon next to address
2. Paste in notepad

**Expected Results**:
- ✅ Full address copied
- ✅ Copy icon changes to checkmark briefly
- ✅ Address matches displayed address

---

### Test 14: Security Warnings

**Objective**: Verify security prompts are clear

**Steps**:
1. Create new wallet
2. Observe all warnings

**Expected Results**:
- ✅ Yellow disclaimer at top of app
- ✅ Red warning on mnemonic screen
- ✅ Checkbox required before proceeding
- ✅ Warning text is clear and prominent

---

### Test 15: Responsive Design

**Objective**: Verify mobile compatibility

**Steps**:
1. Open DevTools (F12)
2. Toggle device toolbar
3. Test different screen sizes:
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - Desktop (1920x1080)

**Expected Results**:
- ✅ Layout adjusts properly
- ✅ All buttons accessible
- ✅ Text readable at all sizes
- ✅ No horizontal scrolling
- ✅ Modals centered properly

---

## Performance Tests

### Load Time
- ✅ Initial load < 3 seconds
- ✅ Balance refresh < 2 seconds
- ✅ Transaction send < 5 seconds (+ network time)

### Memory Usage
- ✅ No memory leaks after 10 transactions
- ✅ Browser tab uses < 100MB RAM

---

## Security Tests

### Encryption Verification

**Test**: Inspect IndexedDB
1. Open DevTools > Application > IndexedDB
2. Expand "WebCryptoWallet" database
3. View "wallets" object store

**Expected Results**:
- ✅ Data is encrypted (ciphertext is base64 gibberish)
- ✅ Salt and IV present
- ✅ No plaintext mnemonic visible

**Test**: Inspect localStorage
1. Open DevTools > Application > localStorage

**Expected Results**:
- ✅ Only theme preference stored
- ✅ NO wallet data in localStorage

---

## Browser Compatibility

Test on:
- ✅ Chrome/Edge (Chromium) - Latest
- ✅ Firefox - Latest  
- ✅ Safari - Latest (macOS/iOS)
- ⚠️ Brave - Latest (may need shields down)

---

## Regression Testing Checklist

After any code changes, verify:

- [ ] Wallet creation works
- [ ] Wallet import works
- [ ] Lock/unlock works
- [ ] Send ETH works
- [ ] Add token works
- [ ] MetaMask connection works
- [ ] Dark mode toggles
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build completes successfully

---

## Known Limitations

1. **Transaction History**: 
   - May not show all transactions due to RPC limitations
   - Consider using Etherscan API for production

2. **Gas Estimation**:
   - May fail for complex contract interactions
   - Manual gas setting not implemented

3. **Token Auto-Discovery**:
   - Tokens must be added manually
   - No automatic detection of token transfers

4. **Network Switching**:
   - Hardcoded to Sepolia
   - Multi-network support not implemented

---

## Reporting Issues

When reporting bugs, include:

1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Browser and version**
5. **Console errors** (if any)
6. **Screenshots** (if helpful)

---

## Success Criteria

All tests passing = ✅ Ready for demo/testing
Any test failing = ❌ Needs fixes before use

**Remember**: Even with all tests passing, this is for educational purposes only!
