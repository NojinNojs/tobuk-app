import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UserLayout from '@/layouts/user-layout';
import { type SharedData } from '@/types';
import { type Book } from '@/types/book';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, ShoppingCart, Tag } from 'lucide-react';
import { useState } from 'react';

interface BookDetailProps {
    book: Book;
}

const conditionColors = {
    new: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800',
    like_new:
        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
    good: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-800',
    fair: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
    poor: 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700',
};

const conditionLabels = {
    new: 'New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
};

// Format price to Indonesian format
function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export default function BookDetail({ book }: BookDetailProps) {
    const { auth } = usePage<SharedData>().props;
    const [activeImage, setActiveImage] = useState(0);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const conditionKey = book.condition as keyof typeof conditionColors;
    const hasImages = book.images && book.images.length > 0;
    const images = hasImages ? book.images : [];
    const isAvailable = book.status === 'available';

    const handleBuyNow = () => {
        if (!isAvailable) return;

        // Redirect based on auth status
        if (auth.user) {
            router.visit(`/checkout?book_id=${book.id}`);
        } else {
            router.visit('/login');
        }
    };

    return (
        <UserLayout>
            <Head title={book.title} />

            <div className="container mx-auto px-4 py-8 pb-32 sm:py-12 sm:pb-12">
                {/* Back Button */}
                <div className="mb-6 sm:mb-8">
                    <Button
                        variant="ghost"
                        asChild
                        className="-ml-4 text-muted-foreground hover:text-foreground"
                    >
                        <Link href="/books">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Collection
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 lg:gap-6">
                    {/* Image Gallery */}
                    <div className="space-y-4 lg:ml-20">
                        <motion.div
                            className="relative aspect-[3/4] max-h-[600px] w-auto overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-900"
                            whileHover={{ scale: isImageZoomed ? 1 : 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            {hasImages ? (
                                <img
                                    src={images[activeImage].url}
                                    alt={book.title}
                                    className="h-full w-full cursor-pointer object-cover transition-transform duration-300"
                                    onClick={() =>
                                        setIsImageZoomed(!isImageZoomed)
                                    }
                                />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-600">
                                    <BookOpen className="h-16 w-16 opacity-40" />
                                    <span className="mt-3 text-sm font-medium tracking-wider uppercase opacity-40">
                                        No Cover Available
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* Thumbnail Carousel */}
                        {images.length > 1 && (
                            <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <motion.button
                                        key={image.id}
                                        onClick={() => setActiveImage(index)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                                            activeImage === index
                                                ? 'border-foreground ring-2 ring-foreground/20'
                                                : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-700'
                                        }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${book.title} ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Book Information */}
                    <div className="flex flex-col">
                        {/* Title & Metadata */}
                        <div className="mb-6">
                            <h1 className="mb-3 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                                {book.title}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <Badge
                                    variant="outline"
                                    className={`font-semibold ${conditionColors[conditionKey]}`}
                                >
                                    <Tag className="mr-1 h-3 w-3" />
                                    {conditionLabels[conditionKey]}
                                </Badge>

                                {/* Status Badge */}
                                {!isAvailable && (
                                    <Badge
                                        variant="secondary"
                                        className="border-yellow-200 bg-yellow-100 font-semibold text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    >
                                        {book.status === 'sold'
                                            ? 'Sold Out'
                                            : 'Booked'}
                                    </Badge>
                                )}

                                <Separator
                                    orientation="vertical"
                                    className="h-4"
                                />
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    Posted{' '}
                                    {new Date(
                                        book.created_at,
                                    ).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-8 rounded-lg border bg-zinc-50 p-4 dark:bg-zinc-900">
                            <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Price
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-semibold text-muted-foreground">
                                    Rp
                                </span>
                                <span className="text-4xl font-bold">
                                    {formatPrice(book.price)}
                                </span>
                            </div>
                        </div>

                        {/* Desktop Buy Button */}
                        <div className="mb-8 hidden lg:block">
                            <Button
                                onClick={handleBuyNow}
                                disabled={!isAvailable}
                                size="lg"
                                className={`h-14 w-full text-lg font-semibold shadow-lg transition-all ${
                                    isAvailable
                                        ? 'bg-foreground text-background hover:bg-foreground/90'
                                        : 'cursor-not-allowed bg-muted text-muted-foreground'
                                }`}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {isAvailable
                                    ? 'Buy Now'
                                    : book.status === 'sold'
                                      ? 'Sold Out'
                                      : 'Currently Booked'}
                            </Button>
                            {!isAvailable && (
                                <p className="mt-2 text-center text-sm text-muted-foreground">
                                    {book.status === 'sold'
                                        ? 'This book has been sold.'
                                        : 'This book is currently reserved in a pending order.'}
                                </p>
                            )}
                        </div>

                        <Separator className="my-6" />

                        {/* Description */}
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                About This Book
                            </h2>
                            <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
                                <p className="leading-relaxed whitespace-pre-wrap text-muted-foreground">
                                    {book.description ||
                                        'No description available for this book.'}
                                </p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Book Details */}
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold">
                                Book Details
                            </h2>
                            <div className="grid gap-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Condition
                                    </span>
                                    <span className="font-medium">
                                        {conditionLabels[conditionKey]}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Listed
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            book.created_at,
                                        ).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Photos
                                    </span>
                                    <span className="font-medium">
                                        {images.length || 'No'} photo
                                        {images.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Floating Buy Button */}
            <div className="fixed right-0 bottom-0 left-0 z-40 lg:hidden">
                {/* Gradient overlay for smooth transition */}
                <div className="pointer-events-none h-12 bg-gradient-to-t from-background to-transparent" />

                {/* Button container */}
                <div className="bg-background/95 px-4 pt-2 pb-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                    >
                        <Button
                            onClick={handleBuyNow}
                            disabled={!isAvailable}
                            size="lg"
                            className={`h-14 w-full text-lg font-semibold shadow-2xl transition-all ${
                                isAvailable
                                    ? 'bg-foreground text-background hover:bg-foreground/90'
                                    : 'cursor-not-allowed bg-muted text-muted-foreground'
                            }`}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {isAvailable
                                ? `Buy Now - Rp ${formatPrice(book.price)}`
                                : book.status === 'sold'
                                  ? 'Sold Out'
                                  : 'Currently Booked'}
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Fullscreen Image Modal */}
            {isImageZoomed && hasImages && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setIsImageZoomed(false)}
                >
                    <motion.img
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        src={images[activeImage].url}
                        alt={book.title}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                    />
                </div>
            )}
        </UserLayout>
    );
}
