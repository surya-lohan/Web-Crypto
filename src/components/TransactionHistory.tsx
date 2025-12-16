import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { formatEth, getExplorerTxUrl } from '../utils/ethereum';
import LoadingSpinner from './LoadingSpinner';

interface EtherscanTransaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timeStamp: string;
    blockNumber: string;
    isError: string;
    gasUsed: string;
    gasPrice: string;
}

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
            const etherscanApiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;
            const chainId = import.meta.env.VITE_CHAIN_ID;

            // Use V2 API endpoint with chainid parameter
            const apiUrl = 'https://api.etherscan.io/v2/api';

            // Build URL with chainid parameter (required for V2)
            const url = `${apiUrl}?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${etherscanApiKey || 'YourApiKeyToken'}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === '1' && Array.isArray(data.result)) {
                const formattedTxs: Transaction[] = data.result.map((tx: EtherscanTransaction) => ({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: BigInt(tx.value),
                    timestamp: parseInt(tx.timeStamp),
                    blockNumber: parseInt(tx.blockNumber),
                    status: tx.isError === '0' ? 1 : 0,
                }));

                setTransactions(formattedTxs);
            } else if (data.status === '0' && data.message === 'No transactions found') {
                setTransactions([]);
            } else {
                console.error('Etherscan API error:', data.message);
                setError(`Failed to fetch transactions: ${data.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Fetch transactions error:', err);
            setError('Failed to fetch transaction history. Please check your network connection.');
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
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                        {error}
                    </p>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        <p className="font-semibold mb-1">To fix this:</p>
                        <ol className="list-decimal ml-5 space-y-1">
                            <li>Get a free API key at: <a href="https://etherscan.io/myapikey" target="_blank" rel="noopener noreferrer" className="underline">etherscan.io/myapikey</a></li>
                            <li>Add it to your .env file: <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">VITE_ETHERSCAN_API_KEY=your_key_here</code></li>
                            <li>Restart the dev server</li>
                        </ol>
                    </div>
                </div>
            )}

            {isLoading && transactions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <LoadingSpinner size="large" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading transaction history...</p>
                </div>
            )}

            {transactions.length === 0 && !isLoading && !error && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No transactions found
                </div>
            )}

            {transactions.length > 0 && (
                <>
                    {isLoading && (
                        <div className="flex items-center justify-center py-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                            <LoadingSpinner size="small" />
                            <span className="ml-3 text-sm text-primary-700 dark:text-primary-300">Refreshing transactions...</span>
                        </div>
                    )}
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
                </>
            )}
        </div>
    );
}
