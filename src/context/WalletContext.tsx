import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';
import { encryptMnemonic, decryptMnemonic } from '../utils/crypto';
import { saveEncryptedWallet, loadEncryptedWallet, deleteWallet, walletExists } from '../utils/storage';
import { getProvider } from '../utils/ethereum';

export type WalletType = 'internal' | 'metamask' | 'walletconnect';

interface WalletState {
  address: string | null;
  balance: bigint | null;
  wallet: ethers.Wallet | null;
  isLocked: boolean;
  walletType: WalletType | null;
  isLoading: boolean;
}

interface WalletContextType extends WalletState {
  // Wallet management
  createWallet: (password: string, wordCount: 12 | 24) => Promise<string>;
  importWalletFromMnemonic: (mnemonic: string, password: string) => Promise<void>;
  importWalletFromPrivateKey: (privateKey: string, password: string) => Promise<void>;
  unlockWallet: (password: string) => Promise<void>;
  lockWallet: () => void;
  deleteStoredWallet: () => Promise<void>;
  hasStoredWallet: () => Promise<boolean>;
  
  // External wallets
  connectMetaMask: () => Promise<void>;
  disconnectWallet: () => void;
  
  // Balance
  refreshBalance: () => Promise<void>;
  
  // Transactions
  sendTransaction: (to: string, amount: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    balance: null,
    wallet: null,
    isLocked: true,
    walletType: null,
    isLoading: true,
  });

  // Check if wallet exists in storage on mount
  useEffect(() => {
    const checkWallet = async () => {
      const exists = await walletExists();
      setState(prev => ({ ...prev, isLocked: exists, isLoading: false }));
    };
    checkWallet();
  }, []);

  // Refresh balance when address changes
  useEffect(() => {
    if (state.address) {
      refreshBalance();
    }
  }, [state.address]);

  /**
   * Create a new wallet with a fresh mnemonic
   */
  const createWallet = useCallback(async (password: string, wordCount: 12 | 24 = 12): Promise<string> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Generate new wallet
      const wallet = ethers.Wallet.createRandom();
      const mnemonic = wallet.mnemonic?.phrase;
      
      if (!mnemonic) {
        throw new Error('Failed to generate mnemonic');
      }

      // Encrypt and save mnemonic
      const encryptedData = await encryptMnemonic(mnemonic, password);
      await saveEncryptedWallet(encryptedData);

      // Connect wallet to provider
      const provider = getProvider();
      const connectedWallet = wallet.connect(provider);

      setState({
        address: wallet.address,
        balance: null,
        wallet: connectedWallet,
        isLocked: false,
        walletType: 'internal',
        isLoading: false,
      });

      // Return mnemonic to display to user (ONCE)
      return mnemonic;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('Error creating wallet:', error);
      throw error;
    }
  }, []);

  /**
   * Import wallet from mnemonic phrase
   */
  const importWalletFromMnemonic = useCallback(async (mnemonic: string, password: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Validate and create wallet from mnemonic
      const wallet = ethers.Wallet.fromPhrase(mnemonic.trim());

      // Encrypt and save mnemonic
      const encryptedData = await encryptMnemonic(mnemonic.trim(), password);
      await saveEncryptedWallet(encryptedData);

      // Connect to provider
      const provider = getProvider();
      const connectedWallet = wallet.connect(provider);

      setState({
        address: wallet.address,
        balance: null,
        wallet: connectedWallet,
        isLocked: false,
        walletType: 'internal',
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('Error importing wallet from mnemonic:', error);
      throw new Error('Invalid mnemonic phrase');
    }
  }, []);

  /**
   * Import wallet from private key
   */
  const importWalletFromPrivateKey = useCallback(async (privateKey: string, password: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Create wallet from private key
      const wallet = new ethers.Wallet(privateKey.trim());

      // For private key imports, we'll store a pseudo-mnemonic (the private key itself, encrypted)
      // In production, consider a different storage strategy
      const encryptedData = await encryptMnemonic(privateKey.trim(), password);
      await saveEncryptedWallet(encryptedData);

      // Connect to provider
      const provider = getProvider();
      const connectedWallet = wallet.connect(provider);

      setState({
        address: wallet.address,
        balance: null,
        wallet: connectedWallet,
        isLocked: false,
        walletType: 'internal',
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('Error importing wallet from private key:', error);
      throw new Error('Invalid private key');
    }
  }, []);

  /**
   * Unlock wallet with password
   */
  const unlockWallet = useCallback(async (password: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Load encrypted data
      const encryptedData = await loadEncryptedWallet();
      if (!encryptedData) {
        throw new Error('No wallet found in storage');
      }

      // Decrypt mnemonic/private key
      const decrypted = await decryptMnemonic(encryptedData, password);

      // Try to determine if it's a mnemonic or private key
      let wallet: ethers.Wallet;
      if (decrypted.split(' ').length >= 12) {
        // It's a mnemonic
        wallet = ethers.Wallet.fromPhrase(decrypted);
      } else {
        // It's a private key
        wallet = new ethers.Wallet(decrypted);
      }

      // Connect to provider
      const provider = getProvider();
      const connectedWallet = wallet.connect(provider);

      setState({
        address: wallet.address,
        balance: null,
        wallet: connectedWallet,
        isLocked: false,
        walletType: 'internal',
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('Error unlocking wallet:', error);
      throw new Error('Failed to unlock wallet. Wrong password?');
    }
  }, []);

  /**
   * Lock the wallet (clear from memory)
   */
  const lockWallet = useCallback(() => {
    setState({
      address: null,
      balance: null,
      wallet: null,
      isLocked: true,
      walletType: null,
      isLoading: false,
    });
  }, []);

  /**
   * Delete wallet from storage permanently
   */
  const deleteStoredWallet = useCallback(async (): Promise<void> => {
    await deleteWallet();
    lockWallet();
  }, [lockWallet]);

  /**
   * Check if wallet exists in storage
   */
  const hasStoredWallet = useCallback(async (): Promise<boolean> => {
    return await walletExists();
  }, []);

  /**
   * Connect MetaMask
   */
  const connectMetaMask = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];

      setState({
        address,
        balance: null,
        wallet: null,
        isLocked: false,
        walletType: 'metamask',
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('Error connecting MetaMask:', error);
      throw error;
    }
  }, []);

  /**
   * Disconnect external wallet
   */
  const disconnectWallet = useCallback(() => {
    setState({
      address: null,
      balance: null,
      wallet: null,
      isLocked: true,
      walletType: null,
      isLoading: false,
    });
  }, []);

  /**
   * Refresh ETH balance
   */
  const refreshBalance = useCallback(async (): Promise<void> => {
    if (!state.address) return;

    try {
      const provider = getProvider();
      const balance = await provider.getBalance(state.address);
      setState(prev => ({ ...prev, balance }));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, [state.address]);

  /**
   * Send ETH transaction
   */
  const sendTransaction = useCallback(async (to: string, amount: string): Promise<string> => {
    if (!state.wallet) {
      throw new Error('No wallet connected');
    }

    try {
      const tx = await state.wallet.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      });

      return tx.hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }, [state.wallet]);

  const value: WalletContextType = {
    ...state,
    createWallet,
    importWalletFromMnemonic,
    importWalletFromPrivateKey,
    unlockWallet,
    lockWallet,
    deleteStoredWallet,
    hasStoredWallet,
    connectMetaMask,
    disconnectWallet,
    refreshBalance,
    sendTransaction,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

// MetaMask type augmentation
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}
