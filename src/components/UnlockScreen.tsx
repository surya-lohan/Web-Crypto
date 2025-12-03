import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import LoadingSpinner from './LoadingSpinner';

export default function UnlockScreen() {
    const { unlockWallet, deleteStoredWallet } = useWallet();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await unlockWallet(password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to unlock wallet');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteStoredWallet();
            setShowDeleteConfirm(false);
        } catch (err) {
            setError('Failed to delete wallet');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="card">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                    Unlock Your Wallet
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                    Enter your password to access your wallet
                </p>

                <form onSubmit={handleUnlock} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pr-10"
                                placeholder="Enter your password"
                                autoFocus
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

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="w-full btn-primary flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="small" className="mr-2" />
                                Unlocking...
                            </>
                        ) : (
                            'Unlock Wallet'
                        )}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                            Delete Wallet from This Device
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">
                                Are you sure? This cannot be undone!
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
