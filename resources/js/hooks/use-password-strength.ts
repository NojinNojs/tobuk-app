import { useMemo } from 'react';

export type PasswordStrength = 'weak' | 'medium' | 'strong';

interface PasswordStrengthResult {
    strength: PasswordStrength;
    score: number;
    feedback: string[];
}

export function usePasswordStrength(password: string): PasswordStrengthResult {
    return useMemo(() => {
        if (!password) {
            return {
                strength: 'weak',
                score: 0,
                feedback: [],
            };
        }

        let score = 0;
        const feedback: string[] = [];

        // Length check
        if (password.length >= 8) {
            score += 1;
        } else {
            feedback.push('At least 8 characters');
        }

        if (password.length >= 12) {
            score += 1;
        }

        // Lowercase check
        if (/[a-z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add lowercase letters');
        }

        // Uppercase check
        if (/[A-Z]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add uppercase letters');
        }

        // Number check
        if (/\d/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add numbers');
        }

        // Special character check
        if (/[^a-zA-Z0-9]/.test(password)) {
            score += 1;
        } else {
            feedback.push('Add special characters');
        }

        let strength: PasswordStrength = 'weak';
        if (score >= 4) {
            strength = 'strong';
        } else if (score >= 2) {
            strength = 'medium';
        }

        return {
            strength,
            score,
            feedback: feedback.slice(0, 2), // Show max 2 feedback items
        };
    }, [password]);
}

