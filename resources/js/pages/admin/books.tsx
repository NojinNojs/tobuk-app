import { BookFormDialog } from '@/components/books/book-form-dialog';
import { BooksTable } from '@/components/books/books-table';
import { DeleteBookDialog } from '@/components/books/delete-book-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin-layout';
import * as admin from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { type Book } from '@/types/book';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: admin.dashboard().url,
    },
    {
        title: 'Books',
        href: '/admin/books',
    },
];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Paginator<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
}

interface BooksPageProps {
    books: Paginator<Book>;
}

export default function Books({ books }: BooksPageProps) {
    const { flash, errors } = usePage<{
        flash: { success?: string; error?: string };
        errors: Record<string, string>;
    }>().props;

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Client-side filters
    const [searchQuery, setSearchQuery] = useState('');
    const [conditionFilter, setConditionFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortOption, setSortOption] = useState<string>('newest');
    const [perPage, setPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Show toast notifications
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (errors && Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) => {
                toast.error(error);
            });
        }
    }, [flash, errors]);

    const handleEdit = (book: Book) => {
        setSelectedBook(book);
        setTimeout(() => setEditDialogOpen(true), 150);
    };

    const handleDelete = (book: Book) => {
        setSelectedBook(book);
        setTimeout(() => setDeleteDialogOpen(true), 150);
    };

    // Filter and search books
    const filteredAndSortedBooks = useMemo(() => {
        const filtered = books.data.filter((book) => {
            const matchesSearch =
                searchQuery === '' ||
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                book.seller_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (book.author &&
                    book.author
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                (book.isbn && book.isbn.includes(searchQuery));

            const matchesCondition =
                conditionFilter === 'all' || book.condition === conditionFilter;

            const matchesStatus =
                statusFilter === 'all' || book.status === statusFilter;

            return matchesSearch && matchesCondition && matchesStatus;
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
    }, [books.data, searchQuery, conditionFilter, statusFilter, sortOption]);

    // Pagination with auto-reset to page 1 when filters change
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

    const handleClearFilters = () => {
        setSearchQuery('');
        setConditionFilter('all');
        setStatusFilter('all');
        setSortOption('newest');
        setPerPage(10);
    };

    // Bulk Selection Logic
    const handleSelect = (id: number, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((i) => i !== id),
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(books.data.map((book) => book.id));
        } else {
            setSelectedIds([]);
        }
    };

    const confirmBulkDelete = () => {
        router.delete('/admin/books/bulk-destroy', {
            data: { ids: selectedIds },
            onSuccess: () => {
                setSelectedIds([]);
                setBulkDeleteDialogOpen(false);
            },
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Book Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Book Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage book inventory and listings
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={() => setBulkDeleteDialogOpen(true)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete ({selectedIds.length})
                            </Button>
                        )}
                        <Button onClick={() => setCreateDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Book
                        </Button>
                    </div>
                </div>

                {/* Books Table */}
                <BooksTable
                    books={paginatedBooks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    selectedIds={selectedIds}
                    onSelect={handleSelect}
                    onSelectAll={handleSelectAll}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    conditionFilter={conditionFilter}
                    onConditionChange={setConditionFilter}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                    perPage={perPage}
                    onPerPageChange={setPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPages={totalPages}
                    totalItems={filteredAndSortedBooks.length}
                    onClearFilters={handleClearFilters}
                    hasActiveFilters={
                        searchQuery !== '' ||
                        conditionFilter !== 'all' ||
                        statusFilter !== 'all' ||
                        sortOption !== 'newest'
                    }
                />
            </div>

            {/* Dialogs */}
            <BookFormDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                mode="create"
            />

            <BookFormDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                book={selectedBook}
                mode="edit"
            />

            <DeleteBookDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                book={selectedBook}
            />

            {/* Bulk Delete Confirmation Dialog */}
            <Dialog
                open={bulkDeleteDialogOpen}
                onOpenChange={setBulkDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Bulk Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedIds.length}{' '}
                            book(s)? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setBulkDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmBulkDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
