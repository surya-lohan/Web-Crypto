import { motion } from 'framer-motion';

interface PasswordStrengthProps {
    password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    const calculateStrength = (pwd: string): number => {
        let strength = 0;
        if (pwd.length >= 8) strength += 25;
        if (pwd.length >= 12) strength += 25;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
        if (/[0-9]/.test(pwd)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(pwd)) strength += 10;
        return Math.min(strength, 100);
    };

    const strength = calculateStrength(password);

    const getColor = () => {
        if (strength < 25) return 'bg-red-500';
        if (strength < 50) return 'bg-orange-500';
        if (strength < 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getLabel = () => {
        if (strength < 25) return 'Weak';
        if (strength < 50) return 'Fair';
        if (strength < 75) return 'Good';
        return 'Strong';
    };

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                <span className={`text-xs font-semibold ${strength < 25 ? 'text-red-500' :
                        strength < 50 ? 'text-orange-500' :
                            strength < 75 ? 'text-yellow-500' :
                                'text-green-500'
                    }`}>
                    {getLabel()}
                </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${getColor()} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${strength}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}
