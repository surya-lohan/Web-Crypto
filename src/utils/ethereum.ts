/**
 * Ethereum and ethers.js Utility Functions
 */

import { ethers } from 'ethers';

/**
 * Get the Ethereum provider from environment configuration
 */
export function getProvider(): ethers.JsonRpcProvider {
  const rpcUrl = import.meta.env.VITE_RPC_URL;
  
  if (!rpcUrl || rpcUrl.includes('YOUR_API_KEY')) {
    throw new Error(
      'RPC URL not configured. Please set VITE_RPC_URL in your .env file.\n' +
      'Get a free API key from https://www.alchemy.com/ or https://infura.io/'
    );
  }

  return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Get network configuration
 */
export function getNetworkConfig() {
  return {
    name: import.meta.env.VITE_NETWORK_NAME || 'Sepolia',
    chainId: parseInt(import.meta.env.VITE_CHAIN_ID || '11155111'),
    explorerUrl: import.meta.env.VITE_ETHERSCAN_URL || 'https://sepolia.etherscan.io',
  };
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Format address for display (0x1234...5678)
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format ETH amount for display
 */
export function formatEth(wei: bigint | string, decimals: number = 4): string {
  try {
    const eth = ethers.formatEther(wei);
    const num = parseFloat(eth);
    return num.toFixed(decimals);
  } catch {
    return '0.0000';
  }
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(
  amount: bigint | string,
  decimals: number,
  displayDecimals: number = 4
): string {
  try {
    const formatted = ethers.formatUnits(amount, decimals);
    const num = parseFloat(formatted);
    return num.toFixed(displayDecimals);
  } catch {
    return '0.0000';
  }
}

/**
 * Get Etherscan transaction URL
 */
export function getExplorerTxUrl(txHash: string): string {
  const config = getNetworkConfig();
  return `${config.explorerUrl}/tx/${txHash}`;
}

/**
 * Get Etherscan address URL
 */
export function getExplorerAddressUrl(address: string): string {
  const config = getNetworkConfig();
  return `${config.explorerUrl}/address/${address}`;
}

/**
 * Validate mnemonic phrase
 */
export function isValidMnemonic(mnemonic: string): boolean {
  try {
    return ethers.Mnemonic.isValidMnemonic(mnemonic.trim());
  } catch {
    return false;
  }
}

/**
 * Validate private key
 */
export function isValidPrivateKey(privateKey: string): boolean {
  try {
    // Try to create a wallet with the private key
    new ethers.Wallet(privateKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  txHash: string,
  confirmations: number = 1
): Promise<ethers.TransactionReceipt | null> {
  try {
    const provider = getProvider();
    return await provider.waitForTransaction(txHash, confirmations);
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    return null;
  }
}

/**
 * Estimate gas with buffer
 */
export async function estimateGasWithBuffer(
  transaction: ethers.TransactionRequest
): Promise<bigint> {
  try {
    const provider = getProvider();
    const estimatedGas = await provider.estimateGas(transaction);
    // Add 20% buffer to be safe
    return (estimatedGas * 120n) / 100n;
  } catch (error) {
    console.error('Gas estimation failed:', error);
    // Return a default gas limit
    return 21000n;
  }
}

/**
 * Get current gas prices (EIP-1559)
 */
export async function getCurrentGasPrices(): Promise<{
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}> {
  try {
    const provider = getProvider();
    const feeData = await provider.getFeeData();
    
    return {
      maxFeePerGas: feeData.maxFeePerGas || ethers.parseUnits('50', 'gwei'),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || ethers.parseUnits('2', 'gwei'),
    };
  } catch (error) {
    console.error('Failed to get gas prices:', error);
    // Return default values
    return {
      maxFeePerGas: ethers.parseUnits('50', 'gwei'),
      maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
    };
  }
}
