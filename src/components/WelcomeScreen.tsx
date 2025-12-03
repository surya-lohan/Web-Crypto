import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Download, Key, Shield, Zap, Lock, TrendingUp, Sparkles } from 'lucide-react';
import CreateWallet from './CreateWallet';
import ImportWallet from './ImportWallet';
import ConnectExternal from './ConnectExternal';
import FloatingElement from './ui/FloatingElement';
import GlassCard from './ui/GlassCard';

type View = 'main' | 'create' | 'import';

export default function WelcomeScreen() {
    const [view, setView] = useState<View>('main');

    if (view === 'create') {
        return <CreateWallet onBack={() => setView('main')} />;
    }

    if (view === 'import') {
        return <ImportWallet onBack={() => setView('main')} />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto relative px-4 sm:px-6 lg:px-8">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingElement delay={0} duration={4} yOffset={30}>
                    <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-64 sm:h-64 bg-primary-500/10 rounded-full blur-3xl" />
                </FloatingElement>
                <FloatingElement delay={1} duration={5} yOffset={40}>
                    <div className="absolute top-20 sm:top-40 right-5 sm:right-20 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500/10 rounded-full blur-3xl" />
                </FloatingElement>
                <FloatingElement delay={2} duration={6} yOffset={25}>
                    <div className="absolute bottom-10 sm:bottom-20 left-1/4 sm:left-1/3 w-36 h-36 sm:w-72 sm:h-72 bg-blue-500/10 rounded-full blur-3xl" />
                </FloatingElement>
            </div>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-center mb-8 sm:mb-12 relative z-10"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl shadow-primary-500/50"
                >
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent px-4"
                >
                    Web Crypto Wallet
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4"
                >
                    Your gateway to the decentralized world. Secure, simple, and powerful.
                </motion.p>
            </motion.div>

            {/* Action Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 relative z-10"
            >
                {/* Create New Wallet */}
                <motion.div variants={itemVariants}>
                    <GlassCard hover={true} className="p-6 h-full group cursor-pointer" delay={0}>
                        <button
                            onClick={() => setView('create')}
                            className="w-full text-left"
                        >
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-primary-500/50 group-hover:shadow-xl group-hover:shadow-primary-500/70 transition-all"
                            >
                                <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </motion.div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                Create New Wallet
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Generate a new wallet with a secure mnemonic phrase and start your crypto journey
                            </p>
                        </button>
                    </GlassCard>
                </motion.div>

                {/* Import Wallet */}
                <motion.div variants={itemVariants}>
                    <GlassCard hover={true} className="p-6 h-full group cursor-pointer" delay={0.1}>
                        <button
                            onClick={() => setView('import')}
                            className="w-full text-left"
                        >
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50 group-hover:shadow-xl group-hover:shadow-purple-500/70 transition-all"
                            >
                                <Download className="w-7 h-7 text-white" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                Import Wallet
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                Import using your existing mnemonic phrase or private key securely
                            </p>
                        </button>
                    </GlassCard>
                </motion.div>

                {/* Connect External */}
                <motion.div variants={itemVariants}>
                    <GlassCard hover={true} className="p-6 h-full group" delay={0.2}>
                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/50 group-hover:shadow-xl group-hover:shadow-orange-500/70 transition-all"
                        >
                            <Key className="w-7 h-7 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Connect Wallet
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            Connect MetaMask or other Web3 wallets instantly
                        </p>
                        <ConnectExternal />
                    </GlassCard>
                </motion.div>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 relative z-10"
            >
                <motion.div variants={itemVariants}>
                    <GlassCard className="p-3 sm:p-5 text-center" delay={0.3}>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-2 sm:mb-3 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1">Bank-Grade Security</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">AES-256-GCM encryption</p>
                    </GlassCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <GlassCard className="p-5 text-center" delay={0.4}>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg shadow-green-500/30">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Lightning Fast</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Instant transactions</p>
                    </GlassCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <GlassCard className="p-5 text-center" delay={0.5}>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Full Privacy</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">100% local storage</p>
                    </GlassCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <GlassCard className="p-5 text-center" delay={0.6}>
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Track Everything</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Real-time updates</p>
                    </GlassCard>
                </motion.div>
            </motion.div>

            {/* Info Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10"
            >
                <motion.div variants={itemVariants}>
                    <GlassCard className="p-6" delay={0.7}>
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
                    </GlassCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <GlassCard className="p-6" delay={0.8}>
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
                    </GlassCard>
                </motion.div>
            </motion.div>
        </div>
    );
}
