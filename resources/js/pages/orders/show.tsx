import { CountdownTimer } from '@/components/countdown-timer';
import { OrderTimeline } from '@/components/order-timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/format';
import { type BreadcrumbItem, type Order } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    CheckCircle,
    Clock,
    Copy,
    CreditCard,
    Package,
    Truck,
    XCircle,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

export default function OrderDetail({ order }: { order: Order }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Orders',
            href: '/orders',
        },
        {
            title: `Order #${order.id}`,
            href: `/orders/${order.id}`,
        },
    ];

    const { data, setData, post, processing } = useForm({
        proof_image: null as File | null,
        sender_account_number: '',
    });

    const { post: cancelOrder, processing: cancelProcessing } = useForm();
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    // Fallback deadline if not provided by backend
    const [fallbackDeadline] = useState(() =>
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    );

    const confirmCancel = () => {
        cancelOrder(`/orders/${order.id}/cancel`, {
            onSuccess: () => setIsCancelDialogOpen(false),
        });
    };

    const submitPaymentProof: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/orders/${order.id}/payment-proof`);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
            case 'completed':
                return 'default'; // Primary color
            case 'cancelled':
            case 'payment_rejected':
                return 'destructive';
            case 'pending_payment':
                return 'secondary'; // Or a custom yellow/orange if available
            default:
                return 'secondary';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            case 'cancelled':
            case 'payment_rejected':
                return <AlertCircle className="h-4 w-4" />;
            case 'pending_payment':
                return <Clock className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id}`} />

            <div className="container mx-auto max-w-5xl space-y-8 px-4 py-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-10 w-10 shrink-0 rounded-full border shadow-sm hover:shadow-md"
                        >
                            <Link href="/orders">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Order Details
                            </h1>
                            <p className="text-sm text-muted-foreground sm:text-base">
                                Order ID: #{order.id} • Placed on{' '}
                                {new Date(order.order_date).toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    },
                                )}
                            </p>
                        </div>
                    </div>

                    <Badge
                        variant={getStatusColor(order.status)}
                        className="flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium tracking-wide uppercase"
                    >
                        {getStatusIcon(order.status)}
                        {order.status.replace('_', ' ')}
                    </Badge>
                </div>

                {/* Timeline */}
                <Card className="border-2 shadow-sm">
                    <CardContent className="p-6">
                        <OrderTimeline status={order.status} />
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12">
                    {/* Left Column: Order Info (Second on Mobile) */}
                    <div className="order-2 space-y-8 lg:order-1 lg:col-span-7">
                        {/* Order Items */}
                        <Card className="border-2 shadow-sm">
                            <CardHeader className="p-6">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                    Items Ordered
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {order.order_items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4"
                                        >
                                            <div className="aspect-[3/4] w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                                                {item.book.images &&
                                                item.book.images.length > 0 ? (
                                                    <img
                                                        src={
                                                            item.book.images[0]
                                                                .url
                                                        }
                                                        alt={item.book.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-600">
                                                        <BookOpen className="h-6 w-6 opacity-40" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between py-1">
                                                <div>
                                                    <h4 className="line-clamp-2 font-semibold">
                                                        {item.book.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatCurrency(
                                                            item.price,
                                                        )}{' '}
                                                        x {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="text-right font-medium">
                                                    {formatCurrency(
                                                        item.price *
                                                            item.quantity,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Separator className="my-6" />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Subtotal
                                        </span>
                                        <span>
                                            {formatCurrency(
                                                order.total -
                                                    (order.unique_code || 0),
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Shipping Cost
                                        </span>
                                        <span className="font-medium text-green-600">
                                            Free
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Unique Code (Admin Fee)
                                        </span>
                                        <span>
                                            {formatCurrency(
                                                order.unique_code || 0,
                                            )}
                                        </span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex items-center justify-between text-lg font-bold">
                                        <span>Total Amount</span>
                                        <span className="text-primary">
                                            {formatCurrency(order.total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Cancel Button - Only for pending_payment */}
                                {order.status === 'pending_payment' && (
                                    <>
                                        <Separator className="my-6" />
                                        <div className="px-6 pb-6">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setIsCancelDialogOpen(true)
                                                }
                                                disabled={cancelProcessing}
                                                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                            >
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Cancel Order
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Shipping Info */}
                        <Card className="border-2 shadow-sm">
                            <CardHeader className="bg-muted/30 p-6 pb-4">
                                <CardTitle className="flex items-center justify-between text-xl">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-5 w-5 text-muted-foreground" />
                                        Shipping Details
                                    </div>
                                    {/* {order.status === 'shipped' && (
                                        <Badge className="bg-blue-600 hover:bg-blue-700">
                                            <Truck className="mr-1 h-3 w-3" />
                                            In Transit
                                        </Badge>
                                    )} */}
                                    {order.status === 'completed' && (
                                        <Badge className="bg-green-600 hover:bg-green-700">
                                            <CheckCircle className="mr-1 h-3 w-3" />
                                            Delivered
                                        </Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Recipient Name
                                        </Label>
                                        <p className="text-base font-semibold">
                                            {order.shipping_name}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Phone Number
                                        </Label>
                                        <p className="text-base font-medium">
                                            {order.shipping_phone}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-1">
                                    <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        Delivery Address
                                    </Label>
                                    <p className="text-base leading-relaxed font-medium">
                                        {order.shipping_address}
                                    </p>
                                </div>

                                {(order.status === 'shipped' ||
                                    order.status === 'completed') &&
                                    order.tracking_number && (
                                        <>
                                            <Separator />
                                            <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 dark:border-blue-800 dark:from-blue-950/30 dark:to-blue-900/20">
                                                <div className="mb-3 flex items-center gap-2">
                                                    <div className="rounded-full bg-blue-600 p-1.5">
                                                        <Truck className="h-4 w-4 text-white" />
                                                    </div>
                                                    <Label className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                                        Tracking Information
                                                    </Label>
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                                            Courier Service
                                                        </p>
                                                        <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                                            {
                                                                order.shipping_method
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                                            Tracking Number
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-mono text-lg font-bold tracking-wider text-blue-900 dark:text-blue-100">
                                                                {
                                                                    order.tracking_number
                                                                }
                                                            </p>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 border-blue-300 bg-white text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900"
                                                                onClick={() =>
                                                                    copyToClipboard(
                                                                        order.tracking_number ||
                                                                            '',
                                                                    )
                                                                }
                                                            >
                                                                <Copy className="mr-1.5 h-3.5 w-3.5" />
                                                                Copy
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Payment & Actions (First on Mobile) */}
                    <div className="order-1 flex flex-col gap-6 lg:order-2 lg:col-span-5">
                        <div className="sticky top-8 space-y-6">
                            {/* Status Message Card - Show when processing, shipped, completed, cancelled, or payment_rejected */}
                            {[
                                'processing',
                                'shipped',
                                'completed',
                                'cancelled',
                                'payment_rejected',
                            ].includes(order.status) &&
                                (() => {
                                    const statusConfig = {
                                        processing: {
                                            icon: Package,
                                            title: 'Order in Progress',
                                            gradient:
                                                'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20',
                                            border: 'border-amber-200 dark:border-amber-800',
                                            iconBg: 'bg-amber-600',
                                            message:
                                                "Your books are being carefully prepared for shipment. We're ensuring everything is perfect before it reaches you!",
                                            quote: 'Books are a uniquely portable magic.',
                                            author: 'Stephen King',
                                        },
                                        shipped: {
                                            icon: Truck,
                                            title: 'On the Way!',
                                            gradient:
                                                'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20',
                                            border: 'border-blue-200 dark:border-blue-800',
                                            iconBg: 'bg-blue-600',
                                            message:
                                                'Your order is on its way! Track your package using the tracking number below. Happy reading awaits!',
                                            quote: 'A reader lives a thousand lives before he dies.',
                                            author: 'George R.R. Martin',
                                        },
                                        completed: {
                                            icon: CheckCircle,
                                            title: 'Order Delivered',
                                            gradient:
                                                'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20',
                                            border: 'border-green-200 dark:border-green-800',
                                            iconBg: 'bg-green-600',
                                            message:
                                                'Your order has been successfully delivered! We hope you enjoy your new books. Thank you for choosing Tobuk!',
                                            quote: 'There is no friend as loyal as a book.',
                                            author: 'Ernest Hemingway',
                                        },
                                        cancelled: {
                                            icon: XCircle,
                                            title: 'Order Cancelled',
                                            gradient:
                                                'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/20',
                                            border: 'border-red-200 dark:border-red-800',
                                            iconBg: 'bg-red-600',
                                            message:
                                                'This order has been cancelled. If you have any questions or would like to place a new order, please do not hesitate to contact us.',
                                            quote: 'So it goes.',
                                            author: 'Kurt Vonnegut',
                                        },
                                        payment_rejected: {
                                            icon: AlertCircle,
                                            title: 'Payment Rejected',
                                            gradient:
                                                'from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20',
                                            border: 'border-red-200 dark:border-red-800',
                                            iconBg: 'bg-red-600',
                                            message:
                                                'We could not verify your payment. Please check your payment details or try uploading the proof again. If you believe this is an error, please contact support.',
                                            quote: 'Failure is simply the opportunity to begin again, this time more intelligently.',
                                            author: 'Henry Ford',
                                        },
                                    };

                                    const config =
                                        statusConfig[
                                            order.status as keyof typeof statusConfig
                                        ];
                                    const Icon = config.icon;

                                    return (
                                        <Card
                                            className={`overflow-hidden border-2 shadow-lg ${config.border}`}
                                        >
                                            <div
                                                className={`bg-gradient-to-br p-6 ${config.gradient}`}
                                            >
                                                <div className="mb-4 flex items-start gap-3">
                                                    <div
                                                        className={`rounded-full p-2 ${config.iconBg}`}
                                                    >
                                                        <Icon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-foreground">
                                                            {config.title}
                                                        </h3>
                                                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                            {config.message}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Separator className="my-4" />
                                                <div className="rounded-lg bg-background/60 p-4 backdrop-blur-sm">
                                                    <p className="text-sm leading-relaxed text-foreground/80 italic">
                                                        "{config.quote}"
                                                    </p>
                                                    <p className="mt-2 text-xs font-semibold text-muted-foreground">
                                                        — {config.author}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })()}

                            {order.status === 'pending_payment' && (
                                <Card className="border-2 border-primary/20 shadow-lg ring-4 ring-primary/5">
                                    <CardHeader className="bg-primary/5 p-6 pb-4 text-center">
                                        <CardTitle className="text-lg font-medium text-primary">
                                            Payment Deadline
                                        </CardTitle>
                                        <div className="flex justify-center pt-2">
                                            <CountdownTimer
                                                deadline={
                                                    order.payment_deadline ||
                                                    fallbackDeadline
                                                }
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Please complete your payment before
                                            the deadline to avoid automatic
                                            cancellation.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Payment Instructions - Only show for pending_payment */}
                            {order.status === 'pending_payment' && (
                                <Card className="border-2 shadow-sm">
                                    <CardHeader className="bg-muted/30 p-6 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-xl">
                                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                                            Payment Instructions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6">
                                        <div className="rounded-lg border bg-yellow-50 p-4 text-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-200">
                                            <div className="flex gap-3">
                                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                                <div className="text-sm">
                                                    <p className="font-medium">
                                                        Important!
                                                    </p>
                                                    <p>
                                                        Transfer exactly up to
                                                        the last 3 digits to
                                                        verify your payment
                                                        automatically.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">
                                                    Bank Destination
                                                </Label>
                                                <div className="flex items-center justify-between rounded-lg border p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-12 items-center justify-center rounded bg-blue-600 font-bold text-white">
                                                            BCA
                                                        </div>
                                                        <span className="font-medium">
                                                            Bank Central Asia
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">
                                                    Account Number
                                                </Label>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 rounded-lg border bg-muted/50 p-3 font-mono text-lg font-bold tracking-wider">
                                                        1234567890
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-12 w-12 shrink-0"
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                '1234567890',
                                                            )
                                                        }
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    a.n. PT Tobuk Indonesia
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">
                                                    Total Amount
                                                </Label>
                                                <div className="relative">
                                                    <div
                                                        className="group flex cursor-pointer items-center justify-between rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                order.total.toString(),
                                                            )
                                                        }
                                                    >
                                                        <span className="text-2xl font-bold text-primary">
                                                            {formatCurrency(
                                                                order.total,
                                                            )}
                                                        </span>
                                                        <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                                                            <Copy className="h-4 w-4" />
                                                            Click to Copy
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Payment Proof Upload - Only show for pending_payment */}
                            {order.status === 'pending_payment' && (
                                <Card className="border-2 shadow-sm">
                                    <CardHeader className="bg-muted/30 p-6 pb-4">
                                        <CardTitle className="flex items-center gap-2 text-xl">
                                            <CheckCircle className="h-5 w-5 text-muted-foreground" />
                                            Payment Confirmation
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {order.payment_proof ? (
                                            <div className="rounded-lg border bg-green-50 p-4 text-center dark:bg-green-950/30">
                                                <div className="mb-2 flex justify-center">
                                                    <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900 dark:text-green-400">
                                                        <CheckCircle className="h-6 w-6" />
                                                    </div>
                                                </div>
                                                <h4 className="font-semibold text-green-900 dark:text-green-100">
                                                    Payment Proof Uploaded
                                                </h4>
                                                <p className="text-sm text-green-700 dark:text-green-300">
                                                    We are verifying your
                                                    payment. This usually takes
                                                    1-2 hours.
                                                </p>
                                                <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                                                    Uploaded on{' '}
                                                    {new Date(
                                                        order.payment_proof.uploaded_at,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        ) : (
                                            <form
                                                onSubmit={submitPaymentProof}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label htmlFor="sender_account">
                                                        Sender Account Name
                                                    </Label>
                                                    <Input
                                                        id="sender_account"
                                                        placeholder="e.g. John Doe"
                                                        value={
                                                            data.sender_account_number
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'sender_account_number',
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="proof_image">
                                                        Upload Transfer Receipt
                                                    </Label>
                                                    <Input
                                                        id="proof_image"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            setData(
                                                                'proof_image',
                                                                e.target.files
                                                                    ? e.target
                                                                          .files[0]
                                                                    : null,
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    disabled={processing}
                                                >
                                                    {processing
                                                        ? 'Uploading...'
                                                        : 'Confirm Payment'}
                                                </Button>
                                            </form>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Waiting Confirmation Message - Show when payment proof uploaded */}
                            {order.status === 'waiting_confirmation' && (
                                <Card className="overflow-hidden border-2 border-purple-200 shadow-lg dark:border-purple-800">
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:from-purple-950/30 dark:to-pink-950/20">
                                        <div className="mb-4 flex items-start gap-3">
                                            <div className="rounded-full bg-purple-600 p-2">
                                                <Clock className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-foreground">
                                                    Payment Under Review
                                                </h3>
                                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                    Thank you for uploading your
                                                    payment proof! Our team is
                                                    currently verifying your
                                                    payment. This process
                                                    typically takes 1-2 hours
                                                    during business hours.
                                                </p>
                                            </div>
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="rounded-lg bg-background/60 p-4 backdrop-blur-sm">
                                            <p className="text-sm leading-relaxed text-foreground/80 italic">
                                                "Reading is essential for those
                                                who seek to rise above the
                                                ordinary."
                                            </p>
                                            <p className="mt-2 text-xs font-semibold text-muted-foreground">
                                                — Jim Rohn
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                open={isCancelDialogOpen}
                onOpenChange={setIsCancelDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Order</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this order? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Keep Order</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={confirmCancel}
                            disabled={cancelProcessing}
                        >
                            {cancelProcessing
                                ? 'Cancelling...'
                                : 'Yes, Cancel Order'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
