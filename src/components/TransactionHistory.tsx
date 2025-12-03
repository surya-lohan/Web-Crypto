import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { getProvider, formatEth, getExplorerTxUrl } from '../utils/ethereum';
import { ethers } from 'ethers';
import LoadingSpinner from './LoadingSpinner';

interface Transaction {
    hash: string;
    from: string;
    to: string | null;
    value: bigint;
    timestamp: number;
    blockNumber: number;
    status?: number;
}

export default function TransactionHistory() {
    const { address } = useWallet();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTransactions = async () => {
        if (!address) return;

        setIsLoading(true);
        setError('');

        try {
            const provider = getProvider();

            // Get transaction history
            // Note: This is a simplified version. For production, use an indexing service like Etherscan API
            const history = await provider.getHistory(address);

            // Get block timestamps
            const txsWithTimestamp = await Promise.all(
                history.slice(0, 20).map(async (tx) => {
                    const block = await provider.getBlock(tx.blockNumber || 0);
                    return {
                        hash: tx.hash,
                        from: tx.from,
                        to: tx.to,
                        value: tx.value,
                        timestamp: block?.timestamp || 0,
                        blockNumber: tx.blockNumber || 0,
                        status: 1, // Assuming successful for history
                    };
                })
            );

            setTransactions(txsWithTimestamp.sort((a, b) => b.timestamp - a.timestamp));
        } catch (err) {
            console.error('Fetch transactions error:', err);
            setError('Failed to fetch transaction history. This may be due to RPC limitations.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [address]);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const getTransactionType = (tx: Transaction) => {
        if (tx.from.toLowerCase() === address?.toLowerCase()) {
            return { type: 'Sent', color: 'text-red-600 dark:text-red-400' };
        } else {
            return { type: 'Received', color: 'text-green-600 dark:text-green-400' };
        }
    };

    if (isLoading && transactions.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Transactions
                </h3>
                <button
                    onClick={fetchTransactions}
                    disabled={isLoading}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {error}
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                        Note: Due to RPC limitations, full transaction history may not be available.
                        Consider using Etherscan API for complete history.
                    </p>
                </div>
            )}

            {transactions.length === 0 && !isLoading && !error && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No transactions found
                </div>
            )}

            {transactions.length > 0 && (
                <div className="space-y-3">
                    {transactions.map((tx) => {
                        const { type, color } = getTransactionType(tx);

                        return (
                            <div
                                key={tx.hash}
                                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <span className={`font-semibold ${color}`}>{type}</span>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {formatDate(tx.timestamp)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900 dark:text-white">
                                            {formatEth(tx.value)} ETH
                                        </div>
                                        <a
                                            href={getExplorerTxUrl(tx.hash)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-end mt-1"
                                        >
                                            View
                                            <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Hash:</span>
                                    <span className="font-mono text-gray-700 dark:text-gray-300">
                                        {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                                    </span>
                                </div>

                                {tx.to && (
                                    <div className="flex items-center space-x-2 text-sm mt-1">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {type === 'Sent' ? 'To:' : 'From:'}
                                        </span>
                                        <span className="font-mono text-gray-700 dark:text-gray-300">
                                            {type === 'Sent'
                                                ? `${tx.to.slice(0, 10)}...${tx.to.slice(-8)}`
                                                : `${tx.from.slice(0, 10)}...${tx.from.slice(-8)}`
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
