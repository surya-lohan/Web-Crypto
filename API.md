# 🔧 API Reference - Web Crypto Wallet

Developer reference for all utilities, contexts, and components.

---

## Table of Contents

1. [Crypto Utilities](#crypto-utilities)
2. [Storage Utilities](#storage-utilities)
3. [Ethereum Utilities](#ethereum-utilities)
4. [ERC20 Utilities](#erc20-utilities)
5. [Wallet Context](#wallet-context)
6. [Theme Context](#theme-context)

---

## Crypto Utilities

Location: `src/utils/crypto.ts`

### `encryptMnemonic(mnemonic: string, password: string): Promise<EncryptedData>`

Encrypts a mnemonic phrase using AES-256-GCM.

**Parameters**:
- `mnemonic` - The mnemonic phrase to encrypt (12 or 24 words)
- `password` - User's password for encryption

**Returns**: Promise resolving to `EncryptedData` object

**Example**:
```typescript
const encrypted = await encryptMnemonic(
  "word1 word2 word3 ...",
  "MyPassword123"
);
// Returns: { ciphertext, salt, iv }
```

**Throws**: Error if encryption fails

---

### `decryptMnemonic(encryptedData: EncryptedData, password: string): Promise<string>`

Decrypts an encrypted mnemonic phrase.

**Parameters**:
- `encryptedData` - Object with ciphertext, salt, and IV
- `password` - User's password for decryption

**Returns**: Promise resolving to plaintext mnemonic

**Example**:
```typescript
const mnemonic = await decryptMnemonic(
  { ciphertext, salt, iv },
  "MyPassword123"
);
// Returns: "word1 word2 word3 ..."
```

**Throws**: Error if password is wrong or data is corrupted

---

### `deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey>`

Derives an encryption key from password using PBKDF2.

**Parameters**:
- `password` - User's password
- `salt` - Random salt (16 bytes)

**Returns**: Promise resolving to CryptoKey for AES-GCM

**Example**:
```typescript
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await deriveKeyFromPassword("MyPassword123", salt);
```

**Details**:
- Algorithm: PBKDF2-HMAC-SHA256
- Iterations: 100,000
- Output: 256-bit key

---

### `validatePassword(password: string): { valid: boolean; message: string }`

Validates password strength.

**Parameters**:
- `password` - Password to validate

**Returns**: Object with validation result and message

**Example**:
```typescript
const result = validatePassword("Test123");
// Returns: { valid: true, message: "Password is strong" }

const result2 = validatePassword("weak");
// Returns: { valid: false, message: "Password too short" }
```

**Rules**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

## Storage Utilities

Location: `src/utils/storage.ts`

### `saveEncryptedWallet(encryptedData: EncryptedData, walletId?: string): Promise<void>`

Saves encrypted wallet to IndexedDB.

**Parameters**:
- `encryptedData` - Encrypted mnemonic data
- `walletId` - Optional wallet identifier (default: "default")

**Returns**: Promise resolving when saved

**Example**:
```typescript
await saveEncryptedWallet(
  { ciphertext, salt, iv },
  "my-wallet"
);
```

**Throws**: Error if storage fails

---

### `loadEncryptedWallet(walletId?: string): Promise<EncryptedData | null>`

Loads encrypted wallet from IndexedDB.

**Parameters**:
- `walletId` - Wallet identifier (default: "default")

**Returns**: Promise resolving to encrypted data or null if not found

**Example**:
```typescript
const data = await loadEncryptedWallet();
if (data) {
  // Decrypt and use
}
```

---

### `deleteWallet(walletId?: string): Promise<void>`

Permanently deletes wallet from IndexedDB.

**Parameters**:
- `walletId` - Wallet identifier (default: "default")

**Returns**: Promise resolving when deleted

**Example**:
```typescript
await deleteWallet();
```

**Warning**: This is permanent and cannot be undone!

---

### `walletExists(walletId?: string): Promise<boolean>`

Checks if a wallet exists in storage.

**Parameters**:
- `walletId` - Wallet identifier (default: "default")

**Returns**: Promise resolving to boolean

**Example**:
```typescript
const exists = await walletExists();
if (exists) {
  // Show unlock screen
} else {
  // Show welcome screen
}
```

---

### `getAllWalletIds(): Promise<string[]>`

Gets all wallet IDs stored in IndexedDB.

**Returns**: Promise resolving to array of wallet IDs

**Example**:
```typescript
const wallets = await getAllWalletIds();
// Returns: ["default", "wallet2", ...]
```

---

## Ethereum Utilities

Location: `src/utils/ethereum.ts`

### `getProvider(): JsonRpcProvider`

Gets configured Ethereum provider.

**Returns**: ethers.js JsonRpcProvider instance

**Example**:
```typescript
const provider = getProvider();
const balance = await provider.getBalance(address);
```

**Throws**: Error if RPC URL not configured

---

### `getNetworkConfig(): NetworkConfig`

Gets network configuration from environment.

**Returns**: Object with network details

**Example**:
```typescript
const config = getNetworkConfig();
// Returns: {
//   name: "Sepolia",
//   chainId: 11155111,
//   explorerUrl: "https://sepolia.etherscan.io"
// }
```

---

### `isValidAddress(address: string): boolean`

Validates Ethereum address.

**Parameters**:
- `address` - Address to validate

**Returns**: true if valid

**Example**:
```typescript
isValidAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb") // true
isValidAddress("0xinvalid") // false
```

---

### `formatAddress(address: string, chars?: number): string`

Formats address for display.

**Parameters**:
- `address` - Full address
- `chars` - Number of chars to show (default: 4)

**Returns**: Formatted address

**Example**:
```typescript
formatAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")
// Returns: "0x742d...0bEb"

formatAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", 6)
// Returns: "0x742d35...5f0bEb"
```

---

### `formatEth(wei: bigint | string, decimals?: number): string`

Formats wei amount to ETH.

**Parameters**:
- `wei` - Amount in wei
- `decimals` - Decimal places (default: 4)

**Returns**: Formatted ETH amount

**Example**:
```typescript
formatEth("1000000000000000000") // "1.0000"
formatEth("1500000000000000000", 2) // "1.50"
```

---

### `formatTokenAmount(amount: bigint | string, decimals: number, displayDecimals?: number): string`

Formats token amount for display.

**Parameters**:
- `amount` - Raw token amount
- `decimals` - Token decimals (e.g., 18 for most tokens)
- `displayDecimals` - Display decimals (default: 4)

**Returns**: Formatted token amount

**Example**:
```typescript
formatTokenAmount("1000000000000000000", 18) // "1.0000"
formatTokenAmount("5000000", 6) // "5.0000" (USDC)
```

---

### `getExplorerTxUrl(txHash: string): string`

Gets Etherscan URL for transaction.

**Parameters**:
- `txHash` - Transaction hash

**Returns**: Full Etherscan URL

**Example**:
```typescript
const url = getExplorerTxUrl("0xabc123...");
// Returns: "https://sepolia.etherscan.io/tx/0xabc123..."
```

---

### `getExplorerAddressUrl(address: string): string`

Gets Etherscan URL for address.

**Parameters**:
- `address` - Ethereum address

**Returns**: Full Etherscan URL

**Example**:
```typescript
const url = getExplorerAddressUrl("0x742d35Cc...");
// Returns: "https://sepolia.etherscan.io/address/0x742d35Cc..."
```

---

### `isValidMnemonic(mnemonic: string): boolean`

Validates BIP39 mnemonic phrase.

**Parameters**:
- `mnemonic` - Mnemonic phrase to validate

**Returns**: true if valid

**Example**:
```typescript
isValidMnemonic("word1 word2 ... word12") // true or false
```

---

### `isValidPrivateKey(privateKey: string): boolean`

Validates private key format.

**Parameters**:
- `privateKey` - Private key to validate

**Returns**: true if valid

**Example**:
```typescript
isValidPrivateKey("0xabc123...") // true or false
```

---

### `copyToClipboard(text: string): Promise<boolean>`

Copies text to clipboard.

**Parameters**:
- `text` - Text to copy

**Returns**: Promise resolving to true if successful

**Example**:
```typescript
const success = await copyToClipboard(address);
if (success) {
  showNotification("Copied!");
}
```

---

### `getCurrentGasPrices(): Promise<{ maxFeePerGas: bigint; maxPriorityFeePerGas: bigint }>`

Gets current EIP-1559 gas prices.

**Returns**: Promise resolving to gas price object

**Example**:
```typescript
const { maxFeePerGas, maxPriorityFeePerGas } = await getCurrentGasPrices();

const tx = {
  to,
  value,
  maxFeePerGas,
  maxPriorityFeePerGas
};
```

---

### `estimateGasWithBuffer(transaction: TransactionRequest): Promise<bigint>`

Estimates gas with 20% safety buffer.

**Parameters**:
- `transaction` - Transaction object

**Returns**: Promise resolving to estimated gas

**Example**:
```typescript
const gas = await estimateGasWithBuffer({
  to: recipientAddress,
  value: ethers.parseEther("0.1")
});
```

---

## ERC20 Utilities

Location: `src/utils/erc20.ts`

### `ERC20_ABI`

Minimal ERC20 ABI for token interactions.

**Included Functions**:
- `name()` - Get token name
- `symbol()` - Get token symbol
- `decimals()` - Get decimals
- `totalSupply()` - Get total supply
- `balanceOf(address)` - Get balance
- `transfer(to, amount)` - Transfer tokens
- `approve(spender, amount)` - Approve spending
- `transferFrom(from, to, amount)` - Transfer from

**Example**:
```typescript
import { ERC20_ABI } from './utils/erc20';
import { ethers } from 'ethers';

const contract = new ethers.Contract(
  tokenAddress,
  ERC20_ABI,
  provider
);

const balance = await contract.balanceOf(userAddress);
```

---

### `TokenInfo` Interface

Type definition for token information.

**Properties**:
```typescript
interface TokenInfo {
  address: string;      // Contract address
  name: string;         // Token name
  symbol: string;       // Token symbol (e.g., "LINK")
  decimals: number;     // Decimal places
  balance: bigint;      // User's balance
}
```

---

## Wallet Context

Location: `src/context/WalletContext.tsx`

### Hook: `useWallet()`

Access wallet state and methods.

**Returns**: WalletContextType object

**Example**:
```typescript
function MyComponent() {
  const {
    address,
    balance,
    isLocked,
    createWallet,
    unlockWallet,
    sendTransaction
  } = useWallet();

  // Use wallet state and methods
}
```

---

### State Properties

**`address: string | null`**
- Current wallet address
- `null` if no wallet connected

**`balance: bigint | null`**
- ETH balance in wei
- `null` if not loaded

**`wallet: ethers.Wallet | null`**
- ethers.js Wallet instance
- `null` if locked or external wallet

**`isLocked: boolean`**
- `true` if wallet is locked
- `false` if unlocked

**`walletType: 'internal' | 'metamask' | 'walletconnect' | null`**
- Type of connected wallet

**`isLoading: boolean`**
- `true` during async operations

---

### Methods

**`createWallet(password: string, wordCount: 12 | 24): Promise<string>`**

Creates new wallet.

**Parameters**:
- `password` - Encryption password
- `wordCount` - Number of mnemonic words

**Returns**: Promise resolving to mnemonic phrase

**Example**:
```typescript
const mnemonic = await createWallet("MyPassword123", 12);
console.log("Save this:", mnemonic);
```

---

**`importWalletFromMnemonic(mnemonic: string, password: string): Promise<void>`**

Imports wallet from mnemonic.

**Parameters**:
- `mnemonic` - 12 or 24 word phrase
- `password` - Encryption password

**Example**:
```typescript
await importWalletFromMnemonic(
  "word1 word2 word3 ...",
  "MyPassword123"
);
```

---

**`importWalletFromPrivateKey(privateKey: string, password: string): Promise<void>`**

Imports wallet from private key.

**Parameters**:
- `privateKey` - Private key (0x...)
- `password` - Encryption password

**Example**:
```typescript
await importWalletFromPrivateKey(
  "0xabc123...",
  "MyPassword123"
);
```

---

**`unlockWallet(password: string): Promise<void>`**

Unlocks encrypted wallet.

**Parameters**:
- `password` - Decryption password

**Example**:
```typescript
try {
  await unlockWallet("MyPassword123");
} catch (error) {
  console.error("Wrong password");
}
```

---

**`lockWallet(): void`**

Locks wallet and clears from memory.

**Example**:
```typescript
lockWallet();
```

---

**`deleteStoredWallet(): Promise<void>`**

Permanently deletes wallet.

**Example**:
```typescript
await deleteStoredWallet();
// Wallet is gone forever!
```

---

**`hasStoredWallet(): Promise<boolean>`**

Checks if wallet exists.

**Returns**: Promise resolving to boolean

**Example**:
```typescript
const exists = await hasStoredWallet();
```

---

**`connectMetaMask(): Promise<void>`**

Connects MetaMask wallet.

**Example**:
```typescript
try {
  await connectMetaMask();
} catch (error) {
  console.error("MetaMask not installed");
}
```

---

**`disconnectWallet(): void`**

Disconnects external wallet.

**Example**:
```typescript
disconnectWallet();
```

---

**`refreshBalance(): Promise<void>`**

Refreshes ETH balance.

**Example**:
```typescript
await refreshBalance();
```

---

**`sendTransaction(to: string, amount: string): Promise<string>`**

Sends ETH transaction.

**Parameters**:
- `to` - Recipient address
- `amount` - Amount in ETH (string)

**Returns**: Promise resolving to transaction hash

**Example**:
```typescript
const txHash = await sendTransaction(
  "0x742d35Cc...",
  "0.1"
);
console.log("Transaction:", txHash);
```

---

## Theme Context

Location: `src/context/ThemeContext.tsx`

### Hook: `useTheme()`

Access theme state and methods.

**Returns**: ThemeContextType object

**Example**:
```typescript
function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark-mode' : 'light-mode'}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}
```

---

### State Properties

**`theme: 'light' | 'dark'`**
- Current theme

---

### Methods

**`toggleTheme(): void`**

Toggles between light and dark mode.

**Example**:
```typescript
toggleTheme(); // Switches theme
```

---

## Type Definitions

### `EncryptedData`

```typescript
interface EncryptedData {
  ciphertext: string;  // Base64 encoded
  salt: string;        // Base64 encoded
  iv: string;          // Base64 encoded
}
```

### `NetworkConfig`

```typescript
interface NetworkConfig {
  name: string;
  chainId: number;
  explorerUrl: string;
}
```

### `WalletType`

```typescript
type WalletType = 'internal' | 'metamask' | 'walletconnect';
```

---

## Error Handling

All async functions may throw errors. Always use try-catch:

```typescript
try {
  await createWallet("password", 12);
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

Common errors:
- "RPC URL not configured"
- "Invalid mnemonic phrase"
- "Failed to decrypt. Wrong password?"
- "Insufficient funds"
- "Invalid address"

---

## Best Practices

1. **Always validate input**:
```typescript
if (!isValidAddress(address)) {
  throw new Error("Invalid address");
}
```

2. **Handle errors gracefully**:
```typescript
try {
  await operation();
} catch (error) {
  showUserFriendlyError(error);
}
```

3. **Clear sensitive data**:
```typescript
let mnemonic = await decryptMnemonic(...);
// Use mnemonic
mnemonic = ""; // Clear when done
```

4. **Use hooks in components only**:
```typescript
// ✅ Good
function MyComponent() {
  const { address } = useWallet();
}

// ❌ Bad - hooks only work in components
const address = useWallet().address;
```

---

## Environment Variables

Access with `import.meta.env`:

```typescript
const rpcUrl = import.meta.env.VITE_RPC_URL;
const chainId = import.meta.env.VITE_CHAIN_ID;
```

All environment variables must be prefixed with `VITE_`.

---

This API reference covers all major utilities and contexts. For component-specific documentation, see the inline comments in each component file.
