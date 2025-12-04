import { cn } from '@/lib/utils';
import { Check, Clock, Package, Truck } from 'lucide-react';

interface OrderTimelineProps {
    status: string;
    className?: string;
}

export function OrderTimeline({ status, className }: OrderTimelineProps) {
    const steps = [
        {
            id: 'placed',
            label: 'Placed',
            icon: Clock,
            description: 'Order received',
        },
        {
            id: 'paid',
            label: 'Paid',
            icon: Check,
            description: 'Payment verified',
        },
        {
            id: 'processing',
            label: 'Processing',
            icon: Package,
            description: 'Preparing your order',
        },
        {
            id: 'shipped',
            label: 'Shipped',
            icon: Truck,
            description: 'On the way',
        },
        {
            id: 'completed',
            label: 'Completed',
            icon: Check,
            description: 'Delivered',
        },
    ];

    const getCurrentStepIndex = (status: string) => {
        if (status === 'cancelled' || status === 'payment_rejected') return -1;
        if (status === 'pending_payment') return 0;
        if (status === 'waiting_confirmation') return 1;

        const index = steps.findIndex((step) => step.id === status);
        return index >= 0 ? index : 0;
    };

    const currentStepIndex = getCurrentStepIndex(status);
    const isCancelled = status === 'cancelled' || status === 'payment_rejected';

    if (isCancelled) {
        return (
            <div className={cn('w-full py-4', className)}>
                <div className="flex items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
                    <span className="font-medium">
                        Order{' '}
                        {status === 'payment_rejected'
                            ? 'Payment Rejected'
                            : 'Cancelled'}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('w-full py-6', className)}>
            <div className="relative flex flex-col justify-between md:flex-row">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isLast = index === steps.length - 1;
                    const isPast = index < currentStepIndex;

                    return (
                        <div
                            key={step.id}
                            className={cn(
                                'relative flex flex-1 flex-col gap-4 md:items-center',
                                // Mobile: Add padding bottom for spacing between steps
                                !isLast && 'pb-8 md:pb-0',
                            )}
                        >
                            {/* Connector Line */}
                            {!isLast && (
                                <>
                                    {/* Desktop Line (Horizontal) */}
                                    <div
                                        className={cn(
                                            'absolute top-5 left-[50%] hidden h-0.5 w-full -translate-y-1/2 md:block',
                                            // Line Styles
                                            isPast
                                                ? 'border-t-2 border-solid border-primary' // Solid Black/Primary (Completed)
                                                : isCurrent
                                                  ? 'border-t-2 border-dashed border-primary' // Dashed Black/Primary (Current)
                                                  : 'border-t-2 border-dashed border-muted-foreground/30', // Dashed Gray (Pending)
                                        )}
                                    />

                                    {/* Mobile Line (Vertical) */}
                                    <div
                                        className={cn(
                                            'absolute top-10 left-5 h-full w-0.5 -translate-x-1/2 md:hidden',
                                            // Line Styles
                                            isPast
                                                ? 'border-l-2 border-solid border-primary'
                                                : isCurrent
                                                  ? 'border-l-2 border-dashed border-primary'
                                                  : 'border-l-2 border-dashed border-muted-foreground/30',
                                        )}
                                    />
                                </>
                            )}

                            {/* Step Circle & Content Container */}
                            <div className="flex items-center gap-4 md:flex-col md:gap-2">
                                {/* Circle */}
                                <div
                                    className={cn(
                                        'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background transition-all duration-300',
                                        isCompleted
                                            ? 'border-primary text-primary'
                                            : 'border-muted-foreground/30 text-muted-foreground',
                                        isCurrent &&
                                            'border-primary ring-4 ring-primary/10',
                                        isPast &&
                                            'bg-primary text-primary-foreground',
                                    )}
                                >
                                    <step.icon className="h-5 w-5" />
                                </div>

                                {/* Text Content */}
                                <div className="flex flex-col md:items-center md:text-center">
                                    <span
                                        className={cn(
                                            'text-sm font-medium',
                                            isCompleted
                                                ? 'text-foreground'
                                                : 'text-muted-foreground',
                                            isCurrent &&
                                                'font-bold text-primary',
                                        )}
                                    >
                                        {step.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {step.description}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
