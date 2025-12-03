import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepProgressProps {
    steps: string[];
    currentStep: number;
}

export default function StepProgress({ steps, currentStep }: StepProgressProps) {
    return (
        <div className="w-full py-4 sm:py-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center flex-1">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 relative z-10
                  ${index < currentStep
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                                        : index === currentStep
                                            ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-lg shadow-primary-500/50 ring-2 sm:ring-4 ring-primary-500/20'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                    }
                `}
                            >
                                {index < currentStep ? (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </motion.div>
                                ) : (
                                    <span className="font-semibold">{index + 1}</span>
                                )}
                            </motion.div>

                            {/* Step Label */}
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className={`
                  absolute top-10 sm:top-12 text-xs font-medium whitespace-nowrap
                  hidden sm:block
                  ${index === currentStep
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }
                `}
                            >
                                {step}
                            </motion.span>
                        </div>

                        {/* Connecting Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-1 sm:mx-2 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: index < currentStep ? '100%' : 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
