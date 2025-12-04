import { BookFilters } from '@/components/books/book-filters';
import { BookGrid } from '@/components/books/book-grid';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import UserLayout from '@/layouts/user-layout';
import { type Book } from '@/types/book';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

interface BooksPageProps {
    books: { data: Book[] };
}

export default function Books({ books }: BooksPageProps) {
    // Client-side filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [conditionFilter, setConditionFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [showSoldBooked, setShowSoldBooked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12; // Books per page

    // Filter and sort books
    const filteredAndSortedBooks = useMemo(() => {
        const filtered = books.data.filter((book) => {
            const matchesSearch =
                searchQuery === '' ||
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesCondition =
                conditionFilter === 'all' || book.condition === conditionFilter;

            const matchesAvailability =
                showSoldBooked || book.status === 'available';

            return matchesSearch && matchesCondition && matchesAvailability;
        });

        // Sort the results
        return [...filtered].sort((a, b) => {
            switch (sortOption) {
                case 'price_asc':
                    return a.price - b.price;
                case 'price_desc':
                    return b.price - a.price;
                case 'title_asc':
                    return a.title.localeCompare(b.title);
                case 'newest':
                default:
                    return (
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    );
            }
        });
    }, [books.data, searchQuery, conditionFilter, sortOption, showSoldBooked]);

    // Pagination
    const adjustedCurrentPage = useMemo(() => {
        const maxPage = Math.ceil(filteredAndSortedBooks.length / perPage) || 1;
        return currentPage > maxPage ? 1 : currentPage;
    }, [filteredAndSortedBooks.length, perPage, currentPage]);

    const paginatedBooks = useMemo(() => {
        const startIndex = (adjustedCurrentPage - 1) * perPage;
        const endIndex = startIndex + perPage;
        return filteredAndSortedBooks.slice(startIndex, endIndex);
    }, [filteredAndSortedBooks, adjustedCurrentPage, perPage]);

    const totalPages = Math.ceil(filteredAndSortedBooks.length / perPage);
    const from =
        filteredAndSortedBooks.length > 0
            ? (adjustedCurrentPage - 1) * perPage + 1
            : 0;
    const to = Math.min(
        adjustedCurrentPage * perPage,
        filteredAndSortedBooks.length,
    );

    const handleClearFilters = () => {
        setSearchQuery('');
        setConditionFilter('all');
        setSortOption('newest');
        setShowSoldBooked(false);
    };

    const hasActiveFilters =
        searchQuery !== '' ||
        conditionFilter !== 'all' ||
        sortOption !== 'newest' ||
        showSoldBooked;

    return (
        <UserLayout>
            <Head title="Browse Books" />

            <div className="container mx-auto px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-8 sm:mb-10">
                    <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:mb-3 sm:text-3xl">
                        Browse Collection
                    </h1>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        {filteredAndSortedBooks.length > 0
                            ? `Showing ${from}–${to} of ${filteredAndSortedBooks.length} books`
                            : 'No books found'}
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 sm:mb-10">
                    <BookFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        conditionFilter={conditionFilter}
                        onConditionChange={setConditionFilter}
                        sortOption={sortOption}
                        onSortChange={setSortOption}
                        showSoldBooked={showSoldBooked}
                        onShowSoldBookedChange={setShowSoldBooked}
                        onClearFilters={handleClearFilters}
                        hasActiveFilters={hasActiveFilters}
                    />
                </div>

                {/* Book Grid */}
                <div className="mb-12">
                    <BookGrid books={paginatedBooks} isLoading={false} />
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        adjustedCurrentPage > 1 &&
                                        setCurrentPage(adjustedCurrentPage - 1)
                                    }
                                    className={
                                        adjustedCurrentPage === 1
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                            {Array.from(
                                { length: Math.min(totalPages, 5) },
                                (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (adjustedCurrentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (
                                        adjustedCurrentPage >=
                                        totalPages - 2
                                    ) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = adjustedCurrentPage - 2 + i;
                                    }
                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                onClick={() =>
                                                    setCurrentPage(pageNum)
                                                }
                                                isActive={
                                                    adjustedCurrentPage ===
                                                    pageNum
                                                }
                                                className="cursor-pointer"
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                },
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        adjustedCurrentPage < totalPages &&
                                        setCurrentPage(adjustedCurrentPage + 1)
                                    }
                                    className={
                                        adjustedCurrentPage === totalPages
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </UserLayout>
    );
}
