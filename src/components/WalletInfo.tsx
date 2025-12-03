import { useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { Copy, ExternalLink, RefreshCw, Check } from 'lucide-react';
import { formatAddress, formatEth, getExplorerAddressUrl, getNetworkConfig, copyToClipboard } from '../utils/ethereum';
import { useState } from 'react';

export default function WalletInfo() {
    const { address, balance, refreshBalance, walletType } = useWallet();
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const networkConfig = getNetworkConfig();

    useEffect(() => {
        // Refresh balance every 15 seconds
        const interval = setInterval(() => {
            refreshBalance();
        }, 15000);

        return () => clearInterval(interval);
    }, [refreshBalance]);

    const handleCopy = async () => {
        if (address && await copyToClipboard(address)) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshBalance();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (!address) return null;

    return (
        <div className="card">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Wallet Address
                    </h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-mono text-gray-900 dark:text-white">
                            {formatAddress(address, 6)}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Copy address"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-600" />
                            ) : (
                                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            )}
                        </button>
                        <a
                            href={getExplorerAddressUrl(address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="View on Etherscan"
                        >
                            <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </a>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {walletType === 'metamask' ? 'MetaMask' : walletType === 'walletconnect' ? 'WalletConnect' : 'Internal'}
                    </div>
                    <div className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                        {networkConfig.name}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Balance
                        </h3>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                            {balance !== null ? formatEth(balance) : '0.0000'} ETH
                        </div>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Refresh balance"
                    >
                        <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}
