import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { isValidAddress, formatEth, getExplorerTxUrl, getCurrentGasPrices, estimateGasWithBuffer } from '../utils/ethereum';
import { ethers } from 'ethers';
import LoadingSpinner from './LoadingSpinner';

export default function SendETH() {
    const { wallet, address: fromAddress, refreshBalance } = useWallet();
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [txHash, setTxHash] = useState('');
    const [estimatedGas, setEstimatedGas] = useState<bigint | null>(null);

    const handleEstimateGas = async () => {
        if (!wallet || !to || !amount) return;

        try {
            const gasEstimate = await estimateGasWithBuffer({
                to,
                value: ethers.parseEther(amount),
                from: fromAddress || undefined,
            });
            setEstimatedGas(gasEstimate);
        } catch (err) {
            console.error('Gas estimation failed:', err);
        }
    };

    const handleSend = async () => {
        setError('');
        setSuccess('');
        setTxHash('');

        // Validation
        if (!isValidAddress(to)) {
            setError('Invalid recipient address');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Invalid amount');
            return;
        }

        if (!wallet) {
            setError('Wallet not connected');
            return;
        }

        setIsLoading(true);

        try {
            // Get current gas prices
            const { maxFeePerGas, maxPriorityFeePerGas } = await getCurrentGasPrices();

            // Create and send transaction
            const tx = await wallet.sendTransaction({
                to,
                value: ethers.parseEther(amount),
                maxFeePerGas,
                maxPriorityFeePerGas,
            });

            setTxHash(tx.hash);
            setSuccess('Transaction sent! Waiting for confirmation...');

            // Wait for confirmation
            const receipt = await tx.wait();

            if (receipt?.status === 1) {
                setSuccess('Transaction confirmed!');
                setTo('');
                setAmount('');
                setEstimatedGas(null);

                // Refresh balance
                setTimeout(() => {
                    refreshBalance();
                }, 2000);
            } else {
                setError('Transaction failed');
            }
        } catch (err: unknown) {
            console.error('Send error:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to send transaction');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Estimate gas when inputs change
    useState(() => {
        const timer = setTimeout(() => {
            if (to && amount) {
                handleEstimateGas();
            }
        }, 500);
        return () => clearTimeout(timer);
    });

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient Address
                </label>
                <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="input-field font-mono text-sm"
                    placeholder="0x..."
                    disabled={isLoading}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (ETH)
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field"
                    placeholder="0.0"
                    step="0.0001"
                    min="0"
                    disabled={isLoading}
                />
            </div>

            {estimatedGas !== null && estimatedGas > 0n && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        Estimated Gas: {formatEth(estimatedGas)} ETH
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-sm text-green-800 dark:text-green-200 mb-2">{success}</p>
                    {txHash && (
                        <a
                            href={getExplorerTxUrl(txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 dark:text-green-400 hover:underline"
                        >
                            View on Etherscan →
                        </a>
                    )}
                </div>
            )}

            <button
                onClick={handleSend}
                disabled={isLoading || !to || !amount}
                className="w-full btn-primary flex items-center justify-center space-x-2"
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner size="small" />
                        <span>Sending...</span>
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        <span>Send ETH</span>
                    </>
                )}
            </button>
        </div>
    );
}
