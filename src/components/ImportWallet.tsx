import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { isValidMnemonic, isValidPrivateKey } from '../utils/ethereum';
import LoadingSpinner from './LoadingSpinner';

interface ImportWalletProps {
    onBack: () => void;
}

type ImportMethod = 'mnemonic' | 'privateKey';

export default function ImportWallet({ onBack }: ImportWalletProps) {
    const { importWalletFromMnemonic, importWalletFromPrivateKey } = useWallet();
    const [method, setMethod] = useState<ImportMethod>('mnemonic');
    const [input, setInput] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImport = async () => {
        setError('');

        // Validate input
        if (method === 'mnemonic' && !isValidMnemonic(input)) {
            setError('Invalid mnemonic phrase. Please check and try again.');
            return;
        }

        if (method === 'privateKey' && !isValidPrivateKey(input)) {
            setError('Invalid private key. Please check and try again.');
            return;
        }

        // Validate password
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            if (method === 'mnemonic') {
                await importWalletFromMnemonic(input, password);
            } else {
                await importWalletFromPrivateKey(input, password);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import wallet');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <button
                onClick={onBack}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </button>

            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Import Wallet
                </h2>

                {/* Method Selector */}
                <div className="flex space-x-2 mb-6">
                    <button
                        onClick={() => {
                            setMethod('mnemonic');
                            setInput('');
                            setError('');
                        }}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${method === 'mnemonic'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        Mnemonic Phrase
                    </button>
                    <button
                        onClick={() => {
                            setMethod('privateKey');
                            setInput('');
                            setError('');
                        }}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${method === 'privateKey'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        Private Key
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Input Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {method === 'mnemonic' ? 'Mnemonic Phrase' : 'Private Key'}
                        </label>
                        <div className="relative">
                            {method === 'mnemonic' ? (
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="input-field min-h-[100px] font-mono text-sm"
                                    placeholder="Enter your 12 or 24 word mnemonic phrase"
                                />
                            ) : (
                                <div className="relative">
                                    <input
                                        type={showInput ? 'text' : 'password'}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="input-field pr-10 font-mono text-sm"
                                        placeholder="Enter your private key (0x...)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowInput(!showInput)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        {showInput ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Encryption Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pr-10"
                                placeholder="Create a password to encrypt your wallet"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field"
                            placeholder="Re-enter your password"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            ⚠️ Never share your {method === 'mnemonic' ? 'mnemonic phrase' : 'private key'} with anyone.
                            We will encrypt and store it securely on your device.
                        </p>
                    </div>

                    <button
                        onClick={handleImport}
                        disabled={isLoading || !input || !password || !confirmPassword}
                        className="w-full btn-primary flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="small" className="mr-2" />
                                Importing Wallet...
                            </>
                        ) : (
                            'Import Wallet'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
