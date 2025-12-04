import { usePasswordStrength, type PasswordStrength } from '@/hooks/use-password-strength';
import { Check, X } from 'lucide-react';
import { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
    password: string;
}

export function PasswordStrengthIndicator({
    password,
}: PasswordStrengthIndicatorProps) {
    const { strength, feedback } = usePasswordStrength(password);

    const strengthConfig = useMemo(() => {
        const configs: Record<
            PasswordStrength,
            { label: string; color: string; bgColor: string; textColor: string }
        > = {
            weak: {
                label: 'Weak',
                color: 'bg-red-500',
                bgColor: 'bg-red-50 dark:bg-red-950',
                textColor: 'text-red-600 dark:text-red-400',
            },
            medium: {
                label: 'Medium',
                color: 'bg-yellow-500',
                bgColor: 'bg-yellow-50 dark:bg-yellow-950',
                textColor: 'text-yellow-600 dark:text-yellow-400',
            },
            strong: {
                label: 'Strong',
                color: 'bg-green-500',
                bgColor: 'bg-green-50 dark:bg-green-950',
                textColor: 'text-green-600 dark:text-green-400',
            },
        };
        return configs[strength];
    }, [strength]);

    if (!password) {
        return null;
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span
                    className={`text-xs font-medium ${strengthConfig.textColor}`}
                >
                    Password strength: {strengthConfig.label}
                </span>
            </div>
            <div className="flex gap-1">
                {[1, 2, 3].map((level) => (
                    <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                            level <=
                            (strength === 'weak'
                                ? 1
                                : strength === 'medium'
                                  ? 2
                                  : 3)
                                ? strengthConfig.color
                                : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    />
                ))}
            </div>
            {feedback.length > 0 && (
                <div
                    className={`rounded-md p-2 text-xs ${strengthConfig.bgColor}`}
                >
                    <ul className="space-y-1">
                        {feedback.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-center gap-2"
                            >
                                <X className="h-3 w-3" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {strength === 'strong' && (
                <div className="flex items-center gap-2 rounded-md bg-green-50 p-2 text-xs text-green-600 dark:bg-green-950 dark:text-green-400">
                    <Check className="h-3 w-3" />
                    <span>Great! Your password is strong.</span>
                </div>
            )}
        </div>
    );
}

