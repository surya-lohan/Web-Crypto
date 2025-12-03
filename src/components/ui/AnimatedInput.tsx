import { motion } from 'framer-motion';
import { InputHTMLAttributes, ReactNode, useState } from 'react';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    error?: string;
}

export default function AnimatedInput({ label, icon, error, className = '', ...props }: AnimatedInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative">
            {label && (
                <motion.label
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                    {label}
                </motion.label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}

                <motion.input
                    {...props}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    className={`
            w-full px-4 py-3 ${icon ? 'pl-10' : ''}
            bg-white/50 dark:bg-gray-800/50 
            border-2 rounded-xl
            transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-primary-500/50
            ${error
                            ? 'border-red-500 focus:border-red-500'
                            : isFocused
                                ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                                : 'border-gray-200 dark:border-gray-700'
                        }
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            ${className}
          `}
                    whileFocus={{ scale: 1.01 }}
                />

                {/* Animated underline effect */}
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: isFocused ? '100%' : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}
