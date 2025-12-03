import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, AlertTriangle, Copy, Check, Lock, Shield, Sparkles } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { validatePassword } from '../utils/crypto';
import LoadingSpinner from './LoadingSpinner';
import AnimatedButton from './ui/AnimatedButton';
import AnimatedInput from './ui/AnimatedInput';
import PasswordStrength from './ui/PasswordStrength';
import StepProgress from './ui/StepProgress';
import GlassCard from './ui/GlassCard';
import Confetti from 'react-confetti';

interface CreateWalletProps {
    onBack: () => void;
}

export default function CreateWallet({ onBack }: CreateWalletProps) {
    const { createWallet } = useWallet();
    const [step, setStep] = useState<'password' | 'mnemonic'>('password');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mnemonic, setMnemonic] = useState('');
    const [mnemonicCopied, setMnemonicCopied] = useState(false);
    const [confirmedBackup, setConfirmedBackup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    const handleCreateWallet = async () => {
        setError('');

        // Validate password
        const validation = validatePassword(password);
        if (!validation.valid) {
            setError(validation.message);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const generatedMnemonic = await createWallet(password, 12);
            setMnemonic(generatedMnemonic);
            setStep('mnemonic');
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create wallet');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyMnemonic = async () => {
        try {
            await navigator.clipboard.writeText(mnemonic);
            setMnemonicCopied(true);
            setTimeout(() => setMnemonicCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const steps = ['Create Password', 'Save Backup'];
    const currentStepIndex = step === 'password' ? 0 : 1;

    if (step === 'mnemonic') {
        return (
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="max-w-3xl mx-auto px-4 sm:px-6"
            >
                {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

                <motion.button
                    onClick={onBack}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </motion.button>

                <StepProgress steps={steps} currentStep={currentStepIndex} />

                <GlassCard className="p-4 sm:p-6 md:p-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-2xl shadow-green-500/50"
                    >
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2"
                    >
                        Backup Your Mnemonic Phrase
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center text-gray-600 dark:text-gray-400 mb-6"
                    >
                        This is your wallet's backup phrase. Keep it secure!
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6"
                    >
                        <div className="flex items-start">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                            </motion.div>
                            <div className="text-sm text-red-800 dark:text-red-200">
                                <p className="font-bold mb-2 text-base">🚨 Critical Security Warning</p>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Write down these words in order and store them safely offline</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Never share your mnemonic with anyone - not even support</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>Anyone with these words has complete access to your funds</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>If you lose these words, your wallet cannot be recovered</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 sm:p-6 mb-4 border-2 border-gray-200 dark:border-gray-700"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {mnemonic.split(' ').map((word, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                    transition={{
                                        delay: 0.5 + index * 0.05,
                                        type: 'spring',
                                        stiffness: 200
                                    }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
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

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <AnimatedButton
                            onClick={handleCopyMnemonic}
                            variant="outline"
                            fullWidth
                            className="mb-6"
                        >
                            {mnemonicCopied ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Copied to Clipboard!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy to Clipboard
                                </>
                            )}
                        </AnimatedButton>

                        <motion.label
                            whileHover={{ scale: 1.02 }}
                            className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 mb-6 cursor-pointer border-2 border-transparent hover:border-primary-500/50 transition-all"
                        >
                            <input
                                type="checkbox"
                                checked={confirmedBackup}
                                onChange={(e) => setConfirmedBackup(e.target.checked)}
                                className="mt-1 w-5 h-5 accent-primary-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                I have written down my mnemonic phrase and stored it in a safe place.
                                I understand that I cannot recover my wallet without it.
                            </span>
                        </motion.label>

                        <AnimatedButton
                            onClick={() => {
                                setMnemonic('');
                            }}
                            disabled={!confirmedBackup}
                            variant="primary"
                            fullWidth
                            size="lg"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Continue to Wallet
                        </AnimatedButton>
                    </motion.div>
                </GlassCard>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="max-w-xl mx-auto px-4 sm:px-6"
        >
            <motion.button
                onClick={onBack}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </motion.button>

            <StepProgress steps={steps} currentStep={currentStepIndex} />

            <GlassCard className="p-4 sm:p-6 md:p-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-2xl shadow-primary-500/50"
                >
                    <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2"
                >
                    Create New Wallet
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8"
                >
                    Set a strong password to encrypt your wallet
                </motion.p>

                <AnimatePresence mode="wait">
                    <motion.div
                        key="password-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <div className="relative">
                                <AnimatedInput
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter a strong password"
                                    label="Password"
                                    icon={<Lock className="w-5 h-5" />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <PasswordStrength password={password} />
                        </div>

                        <AnimatedInput
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            label="Confirm Password"
                            icon={<Shield className="w-5 h-5" />}
                        />

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4"
                            >
                                <p className="text-sm font-semibold text-red-800 dark:text-red-200 flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5"
                        >
                            <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                                <Shield className="w-4 h-4 mr-2" />
                                Password Requirements
                            </p>
                            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                <motion.li
                                    className="flex items-center"
                                    animate={{ opacity: password.length >= 8 ? 1 : 0.5 }}
                                >
                                    <span className={`mr-2 ${password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                                        {password.length >= 8 ? '✓' : '○'}
                                    </span>
                                    At least 8 characters
                                </motion.li>
                                <motion.li
                                    className="flex items-center"
                                    animate={{ opacity: /[A-Z]/.test(password) ? 1 : 0.5 }}
                                >
                                    <span className={`mr-2 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                                        {/[A-Z]/.test(password) ? '✓' : '○'}
                                    </span>
                                    One uppercase letter
                                </motion.li>
                                <motion.li
                                    className="flex items-center"
                                    animate={{ opacity: /[a-z]/.test(password) ? 1 : 0.5 }}
                                >
                                    <span className={`mr-2 ${/[a-z]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                                        {/[a-z]/.test(password) ? '✓' : '○'}
                                    </span>
                                    One lowercase letter
                                </motion.li>
                                <motion.li
                                    className="flex items-center"
                                    animate={{ opacity: /[0-9]/.test(password) ? 1 : 0.5 }}
                                >
                                    <span className={`mr-2 ${/[0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                                        {/[0-9]/.test(password) ? '✓' : '○'}
                                    </span>
                                    One number
                                </motion.li>
                            </ul>
                        </motion.div>

                        <AnimatedButton
                            onClick={handleCreateWallet}
                            disabled={isLoading || !password || !confirmPassword}
                            variant="primary"
                            fullWidth
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner size="small" className="mr-2" />
                                    Creating Wallet...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Create Wallet
                                </>
                            )}
                        </AnimatedButton>
                    </motion.div>
                </AnimatePresence>
            </GlassCard>
        </motion.div>
    );
}
