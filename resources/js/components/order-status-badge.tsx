import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    AlertCircle,
    Ban,
    Check,
    CheckCircle,
    Clock,
    Package,
    Truck,
    XCircle,
} from 'lucide-react';

type OrderStatus =
    | 'pending_payment'
    | 'waiting_confirmation'
    | 'paid'
    | 'payment_rejected'
    | 'processing'
    | 'shipped'
    | 'completed'
    | 'cancelled';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    className?: string;
    showIcon?: boolean;
}

const statusConfig: Record<
    OrderStatus,
    {
        label: string;
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
        icon: React.ComponentType<{ className?: string }>;
        className: string;
    }
> = {
    pending_payment: {
        label: 'Pending Payment',
        variant: 'outline',
        icon: Clock,
        className:
            'border-yellow-500 text-yellow-700 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800',
    },
    waiting_confirmation: {
        label: 'Waiting Confirmation',
        variant: 'outline',
        icon: AlertCircle,
        className:
            'border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800',
    },
    paid: {
        label: 'Paid',
        variant: 'outline',
        icon: CheckCircle,
        className:
            'border-green-500 text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800',
    },
    payment_rejected: {
        label: 'Payment Rejected',
        variant: 'destructive',
        icon: XCircle,
        className: '',
    },
    processing: {
        label: 'Processing',
        variant: 'outline',
        icon: Package,
        className:
            'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
    },
    shipped: {
        label: 'Shipped',
        variant: 'outline',
        icon: Truck,
        className:
            'border-purple-500 text-purple-700 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800',
    },
    completed: {
        label: 'Completed',
        variant: 'default',
        icon: Check,
        className:
            'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:text-white',
    },
    cancelled: {
        label: 'Cancelled',
        variant: 'secondary',
        icon: Ban,
        className: 'dark:bg-zinc-800 dark:text-zinc-400',
    },
};

export function OrderStatusBadge({
    status,
    className,
    showIcon = true,
}: OrderStatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge
            variant={config.variant}
            className={cn(config.className, className)}
        >
            {showIcon && <Icon className="mr-1 h-3 w-3" />}
            {config.label}
        </Badge>
    );
}
