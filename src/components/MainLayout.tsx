import { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

// Components
import WelcomeScreen from './WelcomeScreen';
import UnlockScreen from './UnlockScreen';
import Dashboard from './Dashboard';
import LoadingSpinner from './LoadingSpinner';

export default function MainLayout() {
    const { isLocked, walletType, isLoading } = useWallet();
    const { theme, toggleTheme } = useTheme();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">W</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Web Crypto Wallet
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Sepolia Testnet
                                </p>
                            </div>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Route based on wallet state */}
                {!isLocked && (walletType === 'internal' || walletType === 'metamask' || walletType === 'walletconnect') ? (
                    <Dashboard />
                ) : isLocked ? (
                    <UnlockScreen />
                ) : (
                    <WelcomeScreen />
                )}
            </main>

            {/* Footer */}
            <footer className="mt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Built with React + ethers.js • Encrypted with Web Crypto API • Stored in IndexedDB
                    </p>
                </div>
            </footer>
        </div>
    );
}
