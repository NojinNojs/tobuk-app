import { BookCard, BookCardSkeleton } from '@/components/books/book-card';
import { type Book } from '@/types/book';
import { BookOpen } from 'lucide-react';

interface BookGridProps {
    books: Book[];
    isLoading?: boolean;
}

export function BookGrid({ books, isLoading }: BookGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <BookCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-12">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <BookOpen className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">No Books Found</h3>
                <p className="text-center text-sm text-muted-foreground">
                    We couldn't find any books matching your criteria.
                    <br />
                    Try adjusting your filters or search query.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    );
}
