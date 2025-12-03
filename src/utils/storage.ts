/**
 * IndexedDB Storage Utilities
 * 
 * Provides a simple interface for storing encrypted wallet data in IndexedDB.
 * Uses the 'idb' library for a cleaner Promise-based API.
 * 
 * ⚠️ SECURITY NOTE: Only encrypted data should be stored here.
 * Never store plaintext mnemonics or private keys!
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { EncryptedData } from './crypto';

const DB_NAME = 'WebCryptoWallet';
const DB_VERSION = 1;
const WALLET_STORE = 'wallets';

interface WalletDB extends DBSchema {
  wallets: {
    key: string;
    value: {
      id: string;
      encryptedData: EncryptedData;
      createdAt: number;
      lastAccessed: number;
    };
  };
}

/**
 * Initialize and open the IndexedDB database
 */
async function getDB(): Promise<IDBPDatabase<WalletDB>> {
  return openDB<WalletDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create wallet store if it doesn't exist
      if (!db.objectStoreNames.contains(WALLET_STORE)) {
        db.createObjectStore(WALLET_STORE, { keyPath: 'id' });
      }
    },
  });
}

/**
 * Save encrypted wallet to IndexedDB
 * 
 * @param encryptedData - Encrypted mnemonic data
 * @param walletId - Optional wallet ID (default: 'default')
 */
export async function saveEncryptedWallet(
  encryptedData: EncryptedData,
  walletId: string = 'default'
): Promise<void> {
  try {
    const db = await getDB();
    
    await db.put(WALLET_STORE, {
      id: walletId,
      encryptedData,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
    });

    console.log('Wallet saved successfully');
  } catch (error) {
    console.error('Error saving wallet:', error);
    throw new Error('Failed to save wallet to storage');
  }
}

/**
 * Load encrypted wallet from IndexedDB
 * 
 * @param walletId - Wallet ID to load (default: 'default')
 * @returns Encrypted wallet data or null if not found
 */
export async function loadEncryptedWallet(
  walletId: string = 'default'
): Promise<EncryptedData | null> {
  try {
    const db = await getDB();
    const wallet = await db.get(WALLET_STORE, walletId);

    if (!wallet) {
      return null;
    }

    // Update last accessed time
    await db.put(WALLET_STORE, {
      ...wallet,
      lastAccessed: Date.now(),
    });

    return wallet.encryptedData;
  } catch (error) {
    console.error('Error loading wallet:', error);
    throw new Error('Failed to load wallet from storage');
  }
}

/**
 * Delete wallet from IndexedDB
 * 
 * @param walletId - Wallet ID to delete (default: 'default')
 */
export async function deleteWallet(walletId: string = 'default'): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(WALLET_STORE, walletId);
    console.log('Wallet deleted successfully');
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw new Error('Failed to delete wallet from storage');
  }
}

/**
 * Check if a wallet exists in storage
 * 
 * @param walletId - Wallet ID to check (default: 'default')
 * @returns true if wallet exists
 */
export async function walletExists(walletId: string = 'default'): Promise<boolean> {
  try {
    const db = await getDB();
    const wallet = await db.get(WALLET_STORE, walletId);
    return wallet !== undefined;
  } catch (error) {
    console.error('Error checking wallet existence:', error);
    return false;
  }
}

/**
 * Get all wallet IDs stored in IndexedDB
 * 
 * @returns Array of wallet IDs
 */
export async function getAllWalletIds(): Promise<string[]> {
  try {
    const db = await getDB();
    const keys = await db.getAllKeys(WALLET_STORE);
    return keys;
  } catch (error) {
    console.error('Error getting wallet IDs:', error);
    return [];
  }
}
