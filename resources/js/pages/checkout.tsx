import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/format';
import { type Book, type User } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

const conditionLabels: Record<string, string> = {
    new: 'New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
};

export default function Checkout({ book, user }: { book: Book; user: User }) {
    const { data, setData, post, processing, errors } = useForm({
        book_id: book.id,
        quantity: 1,
        shipping_name: (user.full_name as string) || user.name,
        shipping_phone: (user.phone as string) || '',
        shipping_address: (user.address as string) || '',
    });

    useEffect(() => {
        if (book.status !== 'available') {
            router.visit(`/books/${book.id}`, {
                method: 'get',
                data: {},
                replace: true,
                preserveState: false,
                preserveScroll: false,
            });
        }
    }, [book]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/orders');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
            <Head title="Checkout" />

            <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
                {/* Header with Back Button */}
                <div className="mb-10 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full border shadow-sm hover:shadow-md"
                        asChild
                    >
                        <Link href={`/books/${book.id}`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Checkout
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Complete your purchase securely
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                    {/* Left Column: Shipping Form */}
                    <div className="space-y-8 lg:col-span-7">
                        <Card className="border-2 shadow-lg">
                            <CardHeader className="space-y-2 p-6 pb-0">
                                <CardTitle className="text-2xl">
                                    Shipping Information
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Enter your delivery details carefully.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-6">
                                <form
                                    id="checkout-form"
                                    onSubmit={submit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="shipping_name"
                                            className="text-base font-semibold"
                                        >
                                            Recipient Name
                                        </Label>
                                        <Input
                                            id="shipping_name"
                                            placeholder="Enter recipient's full name"
                                            className="h-12 text-base"
                                            value={data.shipping_name}
                                            onChange={(e) =>
                                                setData(
                                                    'shipping_name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.shipping_name && (
                                            <p className="text-sm font-medium text-red-500">
                                                {errors.shipping_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="shipping_phone"
                                            className="text-base font-semibold"
                                        >
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="shipping_phone"
                                            placeholder="e.g. 08123456789"
                                            className="h-12 text-base"
                                            value={data.shipping_phone}
                                            onChange={(e) =>
                                                setData(
                                                    'shipping_phone',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.shipping_phone && (
                                            <p className="text-sm font-medium text-red-500">
                                                {errors.shipping_phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="shipping_address"
                                            className="text-base font-semibold"
                                        >
                                            Delivery Address
                                        </Label>
                                        <Textarea
                                            id="shipping_address"
                                            placeholder="Enter complete address including street name, RT/RW, kelurahan, kecamatan, city, and postal code"
                                            className="min-h-[140px] resize-none text-base leading-relaxed"
                                            value={data.shipping_address}
                                            onChange={(e) =>
                                                setData(
                                                    'shipping_address',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        {errors.shipping_address && (
                                            <p className="text-sm font-medium text-red-500">
                                                {errors.shipping_address}
                                            </p>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8 space-y-6">
                            <Card className="overflow-hidden border-2 shadow-xl">
                                <CardHeader className="space-y-2 bg-muted/50 p-6 pb-6">
                                    <CardTitle className="text-2xl">
                                        Order Summary
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Review your order details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8 p-8">
                                    {/* Book Details */}
                                    <div className="flex gap-6">
                                        <div className="aspect-[3/4] w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-muted shadow-md">
                                            {book.images &&
                                            book.images.length > 0 ? (
                                                <img
                                                    src={book.images[0].url}
                                                    alt={book.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-600">
                                                    <BookOpen className="h-10 w-10 opacity-40" />
                                                    <span className="mt-2 text-xs font-medium tracking-wider uppercase opacity-40">
                                                        No Cover
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between space-y-3 py-1">
                                            <div className="space-y-2">
                                                <h3 className="line-clamp-2 text-lg leading-tight font-bold">
                                                    {book.title}
                                                </h3>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    Condition:{' '}
                                                    {conditionLabels[
                                                        book.condition
                                                    ] || book.condition}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary ring-1 ring-primary/20">
                                                    Stock: 1
                                                </span>
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    Pre-loved
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="my-6" />

                                    {/* Price Breakdown */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-base">
                                            <span className="font-medium text-muted-foreground">
                                                Price
                                            </span>
                                            <span className="font-semibold">
                                                {formatCurrency(book.price)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span className="font-medium text-muted-foreground">
                                                Quantity
                                            </span>
                                            <span className="font-semibold">
                                                1
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span className="font-medium text-muted-foreground">
                                                Shipping
                                            </span>
                                            <span className="font-bold text-green-600">
                                                Free
                                            </span>
                                        </div>
                                    </div>

                                    <Separator className="my-6" />

                                    {/* Total */}
                                    <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
                                        <span className="text-lg font-bold">
                                            Total
                                        </span>
                                        <span className="text-2xl font-bold text-primary">
                                            {formatCurrency(book.price)}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-4 bg-muted/50 p-8 pt-6">
                                    <Button
                                        className="h-14 w-full text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
                                        size="lg"
                                        type="submit"
                                        form="checkout-form"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Processing...'
                                            : 'Confirm Order'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-12 w-full border-2 text-base font-semibold"
                                        asChild
                                    >
                                        <Link href={`/books/${book.id}`}>
                                            Cancel
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
