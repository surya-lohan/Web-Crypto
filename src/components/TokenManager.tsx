import { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { ethers } from 'ethers';
import { ERC20_ABI, TokenInfo } from '../utils/erc20';
import { getProvider, isValidAddress, formatTokenAmount, getExplorerTxUrl } from '../utils/ethereum';
import LoadingSpinner from './LoadingSpinner';

export default function TokenManager() {
    const { wallet, address } = useWallet();
    const [tokens, setTokens] = useState<TokenInfo[]>([]);
    const [tokenAddress, setTokenAddress] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');

    // Send token state
    const [sendingToken, setSendingToken] = useState<TokenInfo | null>(null);
    const [sendTo, setSendTo] = useState('');
    const [sendAmount, setSendAmount] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [txHash, setTxHash] = useState('');

    const addToken = async () => {
        setError('');

        if (!isValidAddress(tokenAddress)) {
            setError('Invalid token address');
            return;
        }

        if (!address) {
            setError('Wallet not connected');
            return;
        }

        setIsAdding(true);

        try {
            const provider = getProvider();
            const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

            // Fetch token info
            const [name, symbol, decimals, balance] = await Promise.all([
                contract.name(),
                contract.symbol(),
                contract.decimals(),
                contract.balanceOf(address),
            ]);

            const tokenInfo: TokenInfo = {
                address: tokenAddress,
                name,
                symbol,
                decimals: Number(decimals),
                balance,
            };

            // Check if token already added
            if (tokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase())) {
                setError('Token already added');
                return;
            }

            setTokens([...tokens, tokenInfo]);
            setTokenAddress('');
        } catch (err) {
            console.error('Add token error:', err);
            setError('Failed to add token. Make sure it\'s a valid ERC20 token.');
        } finally {
            setIsAdding(false);
        }
    };

    const refreshTokenBalance = async (token: TokenInfo) => {
        if (!address) return;

        try {
            const provider = getProvider();
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const balance = await contract.balanceOf(address);

            setTokens(tokens.map(t =>
                t.address === token.address ? { ...t, balance } : t
            ));
        } catch (err) {
            console.error('Refresh balance error:', err);
        }
    };

    const sendToken = async () => {
        if (!sendingToken || !wallet || !sendTo || !sendAmount) return;

        setError('');
        setIsSending(true);

        try {
            if (!isValidAddress(sendTo)) {
                setError('Invalid recipient address');
                return;
            }

            const contract = new ethers.Contract(sendingToken.address, ERC20_ABI, wallet);
            const amount = ethers.parseUnits(sendAmount, sendingToken.decimals);

            const tx = await contract.transfer(sendTo, amount);
            setTxHash(tx.hash);

            await tx.wait();

            // Refresh balance
            await refreshTokenBalance(sendingToken);

            // Reset form
            setSendingToken(null);
            setSendTo('');
            setSendAmount('');
            setTxHash('');
        } catch (err: unknown) {
            console.error('Send token error:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to send token');
            }
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Add Token Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add Token
                </h3>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        className="input-field flex-1 font-mono text-sm"
                        placeholder="Token contract address (0x...)"
                        disabled={isAdding}
                    />
                    <button
                        onClick={addToken}
                        disabled={isAdding || !tokenAddress}
                        className="btn-primary flex items-center space-x-2"
                    >
                        {isAdding ? (
                            <LoadingSpinner size="small" />
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                <span>Add</span>
                            </>
                        )}
                    </button>
                </div>

                {error && !sendingToken && (
                    <div className="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                )}
            </div>

            {/* Token List */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Your Tokens
                </h3>

                {tokens.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No tokens added yet. Add a token above to get started.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tokens.map((token) => (
                            <div
                                key={token.address}
                                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex items-center justify-between"
                            >
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                        {token.name} ({token.symbol})
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                        {token.address.slice(0, 10)}...{token.address.slice(-8)}
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                        {formatTokenAmount(token.balance, token.decimals)} {token.symbol}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSendingToken(token)}
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Send</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Send Token Modal */}
            {sendingToken && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="card max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Send {sendingToken.symbol}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Recipient Address
                                </label>
                                <input
                                    type="text"
                                    value={sendTo}
                                    onChange={(e) => setSendTo(e.target.value)}
                                    className="input-field font-mono text-sm"
                                    placeholder="0x..."
                                    disabled={isSending}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={sendAmount}
                                    onChange={(e) => setSendAmount(e.target.value)}
                                    className="input-field"
                                    placeholder="0.0"
                                    step="0.000001"
                                    min="0"
                                    disabled={isSending}
                                />
                                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Balance: {formatTokenAmount(sendingToken.balance, sendingToken.decimals)} {sendingToken.symbol}
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                                </div>
                            )}

                            {txHash && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                    <p className="text-sm text-green-800 dark:text-green-200 mb-2">Transaction sent!</p>
                                    <a
                                        href={getExplorerTxUrl(txHash)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-green-600 dark:text-green-400 hover:underline"
                                    >
                                        View on Etherscan →
                                    </a>
                                </div>
                            )}

                            <div className="flex space-x-3">
                                <button
                                    onClick={sendToken}
                                    disabled={isSending || !sendTo || !sendAmount}
                                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                                >
                                    {isSending ? (
                                        <>
                                            <LoadingSpinner size="small" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <span>Send</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setSendingToken(null);
                                        setSendTo('');
                                        setSendAmount('');
                                        setError('');
                                        setTxHash('');
                                    }}
                                    disabled={isSending}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
