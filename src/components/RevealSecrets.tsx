import { useState } from 'react';
import { Eye, EyeOff, Copy, Key, Shield, AlertTriangle } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { decryptMnemonic } from '../utils/crypto';
import { loadEncryptedWallet } from '../utils/storage';
import { copyToClipboard } from '../utils/ethereum';
import LoadingSpinner from './LoadingSpinner';
import AnimatedButton from './ui/AnimatedButton';
import GlassCard from './ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function RevealSecrets() {
    const { wallet } = useWallet();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [mnemonic, setMnemonic] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [showMnemonic, setShowMnemonic] = useState(false);
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const handleReveal = async () => {
        if (!password) {
            setError('Please enter your password');
            return;
        }

        setIsVerifying(true);
        setError('');

        try {
            // Load and decrypt the wallet
            const encryptedData = await loadEncryptedWallet();
            if (!encryptedData) {
                setError('No wallet found');
                return;
            }

            const decryptedMnemonic = await decryptMnemonic(encryptedData, password);
            setMnemonic(decryptedMnemonic);

            // Get private key from wallet
            if (wallet) {
                setPrivateKey(wallet.privateKey);
            }

            setIsRevealed(true);
            setPassword(''); // Clear password after successful verification
        } catch (err) {
            console.error('Failed to reveal secrets:', err);
            setError('Incorrect password. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleCopy = async (text: string, type: 'mnemonic' | 'privateKey') => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopySuccess(type);
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    const handleClose = () => {
        setIsRevealed(false);
        setMnemonic('');
        setPrivateKey('');
        setPassword('');
        setShowMnemonic(false);
        setShowPrivateKey(false);
        setError('');
    };

    if (!isRevealed) {
        return (
            <GlassCard className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Reveal Secret Recovery Phrase
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enter your password to view your mnemonic phrase and private key
                        </p>
                    </div>
                </div>

                {/* Security Warning */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-800 dark:text-red-200">
                            <p className="font-semibold mb-2">⚠️ Security Warning</p>
                            <ul className="list-disc ml-5 space-y-1">
                                <li>Never share your recovery phrase or private key with anyone</li>
                                <li>Anyone with these can access and steal your funds</li>
                                <li>Make sure no one is watching your screen</li>
                                <li>Avoid taking screenshots</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Password Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter Your Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleReveal()}
                            className="w-full px-4 py-3 pr-10 bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none text-gray-900 dark:text-white"
                            placeholder="Enter your wallet password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6"
                    >
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </motion.div>
                )}

                <AnimatedButton
                    onClick={handleReveal}
                    disabled={!password || isVerifying}
                    variant="primary"
                    className="w-full"
                >
                    {isVerifying ? (
                        <>
                            <LoadingSpinner size="small" className="mr-2" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            <Eye className="w-5 h-5 mr-2" />
                            Reveal Secrets
                        </>
                    )}
                </AnimatedButton>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-6">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Key className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Secret Recovery Information
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Keep this information safe and never share it
                        </p>
                    </div>
                </div>
                <AnimatedButton
                    onClick={handleClose}
                    variant="outline"
                    size="sm"
                >
                    Close
                </AnimatedButton>
            </div>

            {/* Mnemonic Phrase Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Recovery Phrase (12 words)
                    </label>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleCopy(mnemonic, 'mnemonic')}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                            <Copy className="w-3.5 h-3.5 mr-1.5" />
                            {copySuccess === 'mnemonic' ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={() => setShowMnemonic(!showMnemonic)}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {showMnemonic ? (
                                <>
                                    <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                                    Hide
                                </>
                            ) : (
                                <>
                                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                                    Show
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {showMnemonic ? (
                        <motion.div
                            key="mnemonic-visible"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                {mnemonic.split(' ').map((word, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white dark:bg-gray-800 rounded-lg px-2 sm:px-3 py-2 text-center shadow-md border border-gray-200 dark:border-gray-700"
                                    >
                                        <span className="text-xs font-bold text-primary-500 mr-1 sm:mr-2">
                                            {index + 1}
                                        </span>
                                        <span className="font-mono text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                            {word}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mnemonic-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center"
                        >
                            <EyeOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Click "Show" to reveal your recovery phrase
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Private Key Section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Private Key
                    </label>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleCopy(privateKey, 'privateKey')}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                            <Copy className="w-3.5 h-3.5 mr-1.5" />
                            {copySuccess === 'privateKey' ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={() => setShowPrivateKey(!showPrivateKey)}
                            className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {showPrivateKey ? (
                                <>
                                    <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                                    Hide
                                </>
                            ) : (
                                <>
                                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                                    Show
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {showPrivateKey ? (
                        <motion.div
                            key="privatekey-visible"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700"
                        >
                            <p className="font-mono text-xs sm:text-sm text-gray-900 dark:text-white break-all">
                                {privateKey}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="privatekey-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 text-center"
                        >
                            <EyeOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Click "Show" to reveal your private key
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Warning */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
            >
                <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                    🔒 Keep this information secure. Anyone with access to your recovery phrase or private key can control your wallet.
                </p>
            </motion.div>
        </GlassCard>
    );
}
