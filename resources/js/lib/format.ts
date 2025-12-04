import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatOrderDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isToday(dateObj)) {
        return `Today at ${format(dateObj, 'HH:mm')}`;
    }

    if (isYesterday(dateObj)) {
        return `Yesterday at ${format(dateObj, 'HH:mm')}`;
    }

    const now = new Date();
    const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

    // If less than 24 hours, show relative time
    if (diffInHours < 24) {
        return formatDistanceToNow(dateObj, { addSuffix: true, locale: id });
    }

    // Otherwise show formatted date
    return format(dateObj, 'dd MMM yyyy', { locale: id });
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}
