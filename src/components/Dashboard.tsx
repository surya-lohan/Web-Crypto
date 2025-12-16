import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import WalletInfo from './WalletInfo';
import SendETH from './SendETH';
import TokenManager from './TokenManager';
import TransactionHistory from './TransactionHistory';
import RevealSecrets from './RevealSecrets';

type Tab = 'send' | 'tokens' | 'history' | 'settings';

export default function Dashboard() {
    const { lockWallet, walletType } = useWallet();
    const [activeTab, setActiveTab] = useState<Tab>('send');

    return (
        <div className="space-y-6">
            {/* Wallet Info Card */}
            <WalletInfo />

            {/* Tab Navigation */}
            <div className="card">
                <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 -mx-6 -mt-6 px-6">
                    <button
                        onClick={() => setActiveTab('send')}
                        className={`px-3 sm:px-4 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors ${activeTab === 'send'
                            ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Send
                    </button>
                    <button
                        onClick={() => setActiveTab('tokens')}
                        className={`px-3 sm:px-4 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors ${activeTab === 'tokens'
                            ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Tokens
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-3 sm:px-4 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors ${activeTab === 'history'
                            ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-3 sm:px-4 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors ${activeTab === 'settings'
                            ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Settings
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'send' && <SendETH />}
                    {activeTab === 'tokens' && <TokenManager />}
                    {activeTab === 'history' && <TransactionHistory />}
                    {activeTab === 'settings' && <RevealSecrets />}
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
