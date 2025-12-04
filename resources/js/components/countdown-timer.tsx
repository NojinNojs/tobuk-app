import { useEffect, useMemo, useState } from 'react';

interface CountdownTimerProps {
    deadline: string;
    onExpire?: () => void;
}

export function CountdownTimer({ deadline, onExpire }: CountdownTimerProps) {
    const calculateTimeLeft = useMemo(() => {
        return () => {
            const difference = +new Date(deadline) - +new Date();

            if (difference > 0) {
                return {
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            } else {
                return null;
            }
        };
    }, [deadline]);

    // Initialize with calculated time
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (newTimeLeft === null && onExpire) {
                onExpire();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft, onExpire]);

    if (!timeLeft) {
        return <span className="font-bold text-destructive">Expired</span>;
    }

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-1 font-mono text-lg font-bold text-primary">
            <span>{formatTime(timeLeft.hours)}</span>
            <span>:</span>
            <span>{formatTime(timeLeft.minutes)}</span>
            <span>:</span>
            <span>{formatTime(timeLeft.seconds)}</span>
        </div>
    );
}
