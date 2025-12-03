import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    delay?: number;
}

export default function GlassCard({ children, className = '', hover = true, delay = 0 }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={hover ? { y: -5, scale: 1.02 } : {}}
            className={`
        backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 
        border border-white/20 dark:border-gray-700/50
        rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50
        transition-all duration-300
        ${hover ? 'hover:shadow-2xl hover:shadow-primary-500/20 dark:hover:shadow-primary-500/20' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
}
