import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import WalletInfo from './WalletInfo';
import SendETH from './SendETH';
import TokenManager from './TokenManager';
import TransactionHistory from './TransactionHistory';

type Tab = 'overview' | 'send' | 'tokens' | 'history';

export default function Dashboard() {
    const { lockWallet, walletType } = useWallet();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    return (
        <div className="space-y-6">
            {/* Wallet Info Card */}
            <WalletInfo />

            {/* Tab Navigation */}
            <div className="card">
                <div className="flex border-b border-gray-200 dark:border-gray-700 -mx-6 -mt-6 px-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${activeTab === 'overview'
                                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('send')}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${activeTab === 'send'
                                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Send
                    </button>
                    <button
                        onClick={() => setActiveTab('tokens')}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${activeTab === 'tokens'
                                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Tokens
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-3 font-medium border-b-2 transition-colors ${activeTab === 'history'
                                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        History
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                Your wallet is ready to use. Navigate to the tabs above to send ETH, manage tokens, or view transaction history.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                    Get Test ETH
                                </h4>
                                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                                    To test this wallet, get free Sepolia ETH from a faucet:
                                </p>
                                <div className="space-y-2">
                                    <a
                                        href="https://sepoliafaucet.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        • Alchemy Sepolia Faucet
                                    </a>
                                    <a
                                        href="https://www.infura.io/faucet/sepolia"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        • Infura Sepolia Faucet
                                    </a>
                                    <a
                                        href="https://faucet.quicknode.com/ethereum/sepolia"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        • QuickNode Sepolia Faucet
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'send' && <SendETH />}
                    {activeTab === 'tokens' && <TokenManager />}
                    {activeTab === 'history' && <TransactionHistory />}
                </div>
            </div>

            {/* Lock Wallet Button */}
            {walletType === 'internal' && (
                <div className="text-center">
                    <button
                        onClick={lockWallet}
                        className="btn-secondary"
                    >
                        Lock Wallet
                    </button>
                </div>
            )}
        </div>
    );
}
