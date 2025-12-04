import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { formatCurrency } from '@/lib/format';
import { type Order } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, CheckCircle, Clock, XCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function AdminOrderDetail({ order }: { order: Order }) {
    const {
        data: verifyData,
        setData: setVerifyData,
        post: postVerify,
        processing: verifyProcessing,
    } = useForm({
        action: '',
        notes: '',
    });

    const {
        data: shipData,
        setData: setShipData,
        post: postShip,
        processing: shipProcessing,
    } = useForm({
        tracking_number: '',
        shipping_method: 'JNE',
    });

    const {
        data: statusData,
        setData: setStatusData,
        patch: patchStatus,
        processing: statusProcessing,
    } = useForm({
        status: order.status,
    });

    const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
    const [verifyAction, setVerifyAction] = useState<
        'approve' | 'reject' | null
    >(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

    const handleVerifyClick = (action: 'approve' | 'reject') => {
        setVerifyAction(action);
        setIsVerifyDialogOpen(true);
    };

    const confirmVerify = () => {
        if (verifyAction) {
            setVerifyData('action', verifyAction);
            postVerify(`/admin/orders/${order.id}/verify`, {
                onSuccess: () => setIsVerifyDialogOpen(false),
            });
        }
    };

    const handleShip: FormEventHandler = (e) => {
        e.preventDefault();
        postShip(`/admin/orders/${order.id}/ship`);
    };

    const handleStatusUpdateClick = (e: React.FormEvent) => {
        e.preventDefault();
        setIsStatusDialogOpen(true);
    };

    const confirmStatusUpdate = () => {
        patchStatus(`/admin/orders/${order.id}/status`, {
            onSuccess: () => setIsStatusDialogOpen(false),
        });
    };

    const handleCompleteClick = () => {
        setStatusData('status', 'completed');
        setIsCompleteDialogOpen(true);
    };

    const confirmComplete = () => {
        patchStatus(`/admin/orders/${order.id}/status`, {
            onSuccess: () => setIsCompleteDialogOpen(false),
        });
    };

    return (
        <AdminLayout>
            <Head title={`Order #${order.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 md:p-6">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-10 w-10 shrink-0 rounded-full border shadow-sm hover:shadow-md"
                    >
                        <Link href="/admin/orders">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Order #{order.id}
                        </h1>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            {order.customer.name} ({order.customer.email})
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-6">
                        {/* Order Details */}
                        <Card>
                            <CardHeader className="p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">
                                            Order Details #{order.id}
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            Placed by {order.customer.name} (
                                            {order.customer.email})
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        className="w-fit px-3 py-1 text-sm"
                                        variant={
                                            order.status === 'paid' ||
                                            order.status === 'completed'
                                                ? 'default'
                                                : order.status ===
                                                        'cancelled' ||
                                                    order.status ===
                                                        'payment_rejected'
                                                  ? 'destructive'
                                                  : 'secondary'
                                        }
                                    >
                                        {order.status
                                            .replace('_', ' ')
                                            .toUpperCase()}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 pt-0">
                                <div className="space-y-2">
                                    <h4 className="font-semibold">
                                        Shipping To
                                    </h4>
                                    <div className="text-sm text-muted-foreground">
                                        <p>{order.shipping_name}</p>
                                        <p>{order.shipping_phone}</p>
                                        <p>{order.shipping_address}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Items</h4>
                                    {order.order_items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-4 py-2"
                                        >
                                            {/* Book Image */}
                                            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
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
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-600">
                                                        <BookOpen className="h-4 w-4 opacity-40" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col gap-1">
                                                <span className="line-clamp-2 font-medium">
                                                    {item.book.title}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {item.quantity} x{' '}
                                                    {formatCurrency(item.price)}
                                                </span>
                                            </div>
                                            <span className="font-medium">
                                                {formatCurrency(
                                                    item.price * item.quantity,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total Amount</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Action */}
                        {['paid', 'processing'].includes(order.status) && (
                            <Card>
                                <CardHeader className="p-6">
                                    <CardTitle className="text-xl">
                                        Process Shipment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <form
                                        onSubmit={handleShip}
                                        className="space-y-4"
                                    >
                                        <div className="grid gap-2">
                                            <Label htmlFor="shipping_method">
                                                Courier
                                            </Label>
                                            <Select
                                                defaultValue={
                                                    shipData.shipping_method
                                                }
                                                onValueChange={(val) =>
                                                    setShipData(
                                                        'shipping_method',
                                                        val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select courier" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="JNE">
                                                        JNE
                                                    </SelectItem>
                                                    <SelectItem value="JNT">
                                                        JNT
                                                    </SelectItem>
                                                    <SelectItem value="SiCepat">
                                                        SiCepat
                                                    </SelectItem>
                                                    <SelectItem value="Pos Indonesia">
                                                        Pos Indonesia
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="tracking_number">
                                                Tracking Number
                                            </Label>
                                            <Input
                                                id="tracking_number"
                                                value={shipData.tracking_number}
                                                onChange={(e) =>
                                                    setShipData(
                                                        'tracking_number',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={shipProcessing}
                                            className="w-full"
                                            size="lg"
                                        >
                                            Mark as Shipped
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}

                        {/* Status Management */}
                        <Card>
                            <CardHeader className="p-6">
                                <CardTitle className="text-xl">
                                    Manage Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6 pt-0">
                                <form
                                    onSubmit={handleStatusUpdateClick}
                                    className="space-y-4"
                                >
                                    <div className="grid gap-2">
                                        <Label htmlFor="status">
                                            Order Status
                                        </Label>
                                        <Select
                                            value={statusData.status}
                                            onValueChange={(val) =>
                                                setStatusData(
                                                    'status',
                                                    val as Order['status'],
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending_payment">
                                                    Pending Payment
                                                </SelectItem>
                                                <SelectItem value="waiting_confirmation">
                                                    Waiting Confirmation
                                                </SelectItem>
                                                <SelectItem value="paid">
                                                    Paid
                                                </SelectItem>
                                                <SelectItem value="processing">
                                                    Processing
                                                </SelectItem>
                                                <SelectItem value="shipped">
                                                    Shipped
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                    Cancelled
                                                </SelectItem>
                                                <SelectItem value="payment_rejected">
                                                    Payment Rejected
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={statusProcessing}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Update Status
                                    </Button>
                                </form>

                                {order.status === 'shipped' && (
                                    <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950/30">
                                        <div className="flex flex-col gap-2">
                                            <span className="font-medium text-green-900 dark:text-green-100">
                                                Order Delivered?
                                            </span>
                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                If the customer has received the
                                                order, mark it as completed.
                                            </p>
                                            <Button
                                                onClick={handleCompleteClick}
                                                disabled={statusProcessing}
                                                className="mt-2 w-full bg-green-600 text-white hover:bg-green-700"
                                            >
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Mark as Completed
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Payment Verification */}
                        <Card>
                            <CardHeader className="p-6">
                                <CardTitle className="text-xl">
                                    Payment Verification
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 pt-0">
                                {order.payment_proof ? (
                                    <div className="space-y-6">
                                        <div className="overflow-hidden rounded-xl border-2 bg-muted/30 shadow-sm">
                                            <img
                                                src={
                                                    order.payment_proof.proof_image_url.startsWith(
                                                        'images/',
                                                    )
                                                        ? `/${order.payment_proof.proof_image_url}`
                                                        : `/storage/${order.payment_proof.proof_image_url}`
                                                }
                                                alt="Payment Proof"
                                                className="max-h-96 w-full object-contain p-6"
                                            />
                                        </div>

                                        <div className="grid gap-4 rounded-lg border p-4 text-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-muted-foreground">
                                                    Sender Account
                                                </span>
                                                <span className="font-medium">
                                                    {order.payment_proof
                                                        .sender_account_number ||
                                                        '-'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-muted-foreground">
                                                    Uploaded At
                                                </span>
                                                <span className="font-medium">
                                                    {new Date(
                                                        order.payment_proof.uploaded_at,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {order.status ===
                                            'waiting_confirmation' && (
                                            <div className="flex gap-4 border-t pt-4">
                                                <Button
                                                    variant="default"
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                    onClick={() =>
                                                        handleVerifyClick(
                                                            'approve',
                                                        )
                                                    }
                                                    disabled={verifyProcessing}
                                                    size="lg"
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Approve Payment
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={() =>
                                                        handleVerifyClick(
                                                            'reject',
                                                        )
                                                    }
                                                    disabled={verifyProcessing}
                                                    size="lg"
                                                >
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Reject Payment
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        <div className="mb-4 flex justify-center">
                                            <Clock className="h-12 w-12 opacity-20" />
                                        </div>
                                        <p>No payment proof uploaded yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Verify Payment Dialog */}
            <Dialog
                open={isVerifyDialogOpen}
                onOpenChange={setIsVerifyDialogOpen}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {verifyAction === 'approve'
                                ? 'Approve Payment'
                                : 'Reject Payment'}
                        </DialogTitle>
                        <DialogDescription>
                            {verifyAction === 'approve'
                                ? 'Confirm that the payment proof is valid and approve this order.'
                                : 'Please provide a reason for rejecting this payment proof.'}
                        </DialogDescription>
                    </DialogHeader>

                    {verifyAction === 'reject' && (
                        <div className="grid gap-2">
                            <Label htmlFor="reject-notes">
                                Rejection Reason
                            </Label>
                            <Textarea
                                id="reject-notes"
                                placeholder="e.g., Payment amount doesn't match, unclear image, wrong account..."
                                value={verifyData.notes}
                                onChange={(e) =>
                                    setVerifyData('notes', e.target.value)
                                }
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">
                                Customer will receive this message via email.
                            </p>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsVerifyDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant={
                                verifyAction === 'reject'
                                    ? 'destructive'
                                    : 'default'
                            }
                            onClick={confirmVerify}
                            disabled={verifyProcessing}
                            className={
                                verifyAction === 'approve'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : ''
                            }
                        >
                            {verifyProcessing
                                ? 'Processing...'
                                : verifyAction === 'approve'
                                  ? 'Approve Payment'
                                  : 'Reject Payment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog
                open={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to update the order status to{' '}
                            <span className="font-medium">
                                {statusData.status.replace('_', ' ')}
                            </span>
                            ?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={confirmStatusUpdate}
                            disabled={statusProcessing}
                        >
                            {statusProcessing ? 'Updating...' : 'Yes, Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Complete Order Dialog */}
            <Dialog
                open={isCompleteDialogOpen}
                onOpenChange={setIsCompleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complete Order</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to mark this order as
                            completed? This confirms that the customer has
                            received their items.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={confirmComplete}
                            disabled={statusProcessing}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {statusProcessing
                                ? 'Processing...'
                                : 'Yes, Mark Completed'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
