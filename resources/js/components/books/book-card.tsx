import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type Book } from '@/types/book';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface BookCardProps {
    book: Book;
    className?: string;
}

const conditionLabels = {
    new: 'New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
};

const statusLabels = {
    available: 'Available',
    booked: 'Booked',
    sold: 'Sold',
};

// Format price to Indonesian format
function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function BookCard({ book, className }: BookCardProps) {
    const hasImage = book.images && book.images.length > 0;
    const coverImage = hasImage ? book.images[0].url : null;
    const conditionKey = book.condition as keyof typeof conditionLabels;
    const isAvailable = book.status === 'available';

    return (
        <Link href={`/books/${book.id}`}>
            <motion.div
                whileHover={isAvailable ? { y: -5 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn('h-full', !isAvailable && 'opacity-80')}
            >
                <Card
                    className={cn(
                        'group h-full overflow-hidden border bg-card shadow-sm transition-shadow',
                        isAvailable && 'hover:shadow-md',
                        className,
                    )}
                >
                    {/* Image Container - Full width at top */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                        {/* Status Badge */}
                        {!isAvailable && (
                            <div className="absolute top-2 right-2 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                                {statusLabels[book.status]}
                            </div>
                        )}

                        {hasImage ? (
                            <img
                                src={coverImage!}
                                alt={book.title}
                                className={cn(
                                    'h-full w-full object-cover transition-transform duration-500',
                                    isAvailable && 'group-hover:scale-105',
                                    !isAvailable && 'grayscale-[0.5]',
                                )}
                            />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-600">
                                <BookOpen className="h-12 w-12 opacity-40" />
                                <span className="mt-2 text-xs font-medium tracking-wider uppercase opacity-40">
                                    No Cover
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Book Info */}
                    <div className="flex flex-col gap-2 px-4 pt-3 pb-4">
                        {/* Title */}
                        <h3 className="line-clamp-2 text-xl leading-snug font-bold text-foreground transition-colors group-hover:text-foreground/80">
                            {book.title}
                        </h3>

                        {/* Condition */}
                        <p className="text-xs text-muted-foreground">
                            Quality:{' '}
                            <span className="font-semibold text-foreground">
                                {conditionLabels[conditionKey]}
                            </span>
                        </p>

                        {/* Price */}
                        <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-sm font-semibold text-muted-foreground">
                                Rp
                            </span>
                            <span className="text-2xl font-bold text-foreground">
                                {formatPrice(book.price)}
                            </span>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </Link>
    );
}

export function BookCardSkeleton() {
    return (
        <Card className="h-full overflow-hidden border shadow-sm">
            <div className="aspect-[3/4] w-full animate-pulse bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex flex-col gap-2 p-4">
                <div className="h-6 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-8 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
        </Card>
    );
}
