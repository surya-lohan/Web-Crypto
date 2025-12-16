import { useState } from 'react';
import { Wallet, Download, Key, Shield, Zap, Lock, TrendingUp, Sparkles } from 'lucide-react';
import CreateWallet from './CreateWallet';
import ImportWallet from './ImportWallet';
import ConnectExternal from './ConnectExternal';

type View = 'main' | 'create' | 'import';

export default function WelcomeScreen() {
    const [view, setView] = useState<View>('main');

    if (view === 'create') {
        return <CreateWallet onBack={() => setView('main')} />;
    }

    if (view === 'import') {
        return <ImportWallet onBack={() => setView('main')} />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
                    Web Crypto Wallet
                </h1>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Your gateway to the decentralized world. Secure, simple, and powerful.
                </p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Create New Wallet */}
                <div className="card p-6 hover:shadow-xl transition-shadow">
                    <button
                        onClick={() => setView('create')}
                        className="w-full text-left"
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4">
                            <Wallet className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Create New Wallet
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Generate a new wallet with a secure mnemonic phrase and start your crypto journey
                        </p>
                    </button>
                </div>

                {/* Import Wallet */}
                <div className="card p-6 hover:shadow-xl transition-shadow">
                    <button
                        onClick={() => setView('import')}
                        className="w-full text-left"
                    >
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                            <Download className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Import Wallet
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Import using your existing mnemonic phrase or private key securely
                        </p>
                    </button>
                </div>

                {/* Connect External */}
                <div className="card p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4">
                        <Key className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Connect Wallet
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Connect MetaMask or other Web3 wallets instantly
                    </p>
                    <ConnectExternal />
                </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="card p-5 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Bank-Grade Security</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">AES-256-GCM encryption</p>
                </div>

                <div className="card p-5 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Lightning Fast</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Instant transactions</p>
                </div>

                <div className="card p-5 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Full Privacy</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">100% local storage</p>
                </div>

                <div className="card p-5 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Track Everything</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Real-time updates</p>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            Security First
                        </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Military-grade AES-256-GCM encryption</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>PBKDF2 with 100,000 iterations</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Local IndexedDB storage only</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Zero server communication</span>
                        </li>
                    </ul>
                </div>

                <div className="card p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            Powerful Features
                        </h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Send & receive ETH on Sepolia testnet</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Full ERC-20 token support</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>Complete transaction history</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span>MetaMask integration ready</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
