import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type Book } from '@/types/book';
import { router } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Edit2,
    LoaderCircle,
    MoreHorizontal,
    RotateCcw,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface BooksTableProps {
    books: Book[];
    onEdit: (book: Book) => void;
    onDelete: (book: Book) => void;
    selectedIds: number[];
    onSelect: (id: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    // Client-side filter states
    searchQuery: string;
    onSearchChange: (value: string) => void;
    conditionFilter: string;
    onConditionChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    sortOption: string;
    onSortChange: (value: string) => void;
    perPage: number;
    onPerPageChange: (value: number) => void;
    currentPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
    totalItems: number;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

export function BooksTable({
    books,
    onEdit,
    onDelete,
    selectedIds,
    onSelect,
    onSelectAll,
    searchQuery,
    onSearchChange,
    conditionFilter,
    onConditionChange,
    statusFilter,
    onStatusChange,
    sortOption,
    onSortChange,
    perPage,
    onPerPageChange,
    currentPage,
    onPageChange,
    totalPages,
    totalItems,
    onClearFilters,
    hasActiveFilters,
}: BooksTableProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [lightboxSlides, setLightboxSlides] = useState<{ src: string }[]>([]);

    // Status toggle dialog state
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [bookToToggle, setBookToToggle] = useState<Book | null>(null);
    const [newStatus, setNewStatus] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    const formatCondition = (condition: string) => {
        return condition
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'new':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            case 'like_new':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'good':
                return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300 border-violet-200 dark:border-violet-800';
            case 'fair':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            case 'poor':
                return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800';
            default:
                return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800';
            case 'booked':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
            case 'sold':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const openStatusDialog = (book: Book) => {
        if (book.status === 'booked') return;
        const targetStatus = book.status === 'available' ? 'sold' : 'available';
        setBookToToggle(book);
        setNewStatus(targetStatus);
        setTimeout(() => setStatusDialogOpen(true), 150);
    };

    const confirmToggleStatus = () => {
        if (!bookToToggle) return;
        setIsProcessing(true);
        router.patch(
            `/admin/books/${bookToToggle.id}/toggle-status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setStatusDialogOpen(false);
                    setBookToToggle(null);
                    setIsProcessing(false);
                },
                onError: () => {
                    setIsProcessing(false);
                },
            },
        );
    };

    const handleImageClick = (book: Book) => {
        if (book.images.length > 0) {
            setLightboxSlides(book.images.map((img) => ({ src: img.url })));
            setLightboxIndex(0);
            setLightboxOpen(true);
        }
    };

    const allSelected =
        books.length > 0 &&
        books.every((book) => selectedIds.includes(book.id));

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by title, author, or ISBN..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Condition Filter */}
                        <Select
                            value={conditionFilter}
                            onValueChange={onConditionChange}
                        >
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Conditions
                                </SelectItem>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="like_new">
                                    Like New
                                </SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                                <SelectItem value="poor">Poor</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select
                            value={statusFilter}
                            onValueChange={onStatusChange}
                        >
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="available">
                                    Available
                                </SelectItem>
                                <SelectItem value="booked">Booked</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort Filter */}
                        <Select value={sortOption} onValueChange={onSortChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">
                                    Newest First
                                </SelectItem>
                                <SelectItem value="price_asc">
                                    Price: Low to High
                                </SelectItem>
                                <SelectItem value="price_desc">
                                    Price: High to Low
                                </SelectItem>
                                <SelectItem value="title_asc">
                                    Title: A-Z
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Per Page Filter */}
                        <Select
                            value={String(perPage)}
                            onValueChange={(value) =>
                                onPerPageChange(Number(value))
                            }
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearFilters}
                                className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="w-[40px] p-4">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={(checked) =>
                                            onSelectAll(!!checked)
                                        }
                                    />
                                </th>
                                <th className="p-4 text-left text-sm font-medium">
                                    Book
                                </th>
                                <th className="p-4 text-left text-sm font-medium">
                                    Description
                                </th>
                                <th className="p-4 text-left text-sm font-medium">
                                    Price
                                </th>
                                <th className="p-4 text-left text-sm font-medium">
                                    Condition
                                </th>
                                <th className="p-4 text-left text-sm font-medium">
                                    Status
                                </th>
                                <th className="p-4 text-left text-sm font-medium">
                                    Seller
                                </th>
                                <th className="p-4 text-right text-sm font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr
                                    key={book.id}
                                    className={`border-b transition-colors hover:bg-muted/50 ${
                                        selectedIds.includes(book.id)
                                            ? 'bg-muted/50'
                                            : ''
                                    }`}
                                >
                                    <td className="p-4">
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                book.id,
                                            )}
                                            onCheckedChange={(checked) =>
                                                onSelect(book.id, !!checked)
                                            }
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleImageClick(book)
                                                }
                                            >
                                                {book.images.length > 0 ? (
                                                    <img
                                                        src={book.images[0].url}
                                                        alt={book.title}
                                                        className="h-16 w-12 rounded object-cover transition-transform hover:scale-105"
                                                        style={{
                                                            aspectRatio: '3/4',
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src="/images/book-placeholder.png"
                                                        alt="No image"
                                                        className="h-16 w-12 rounded object-cover opacity-50"
                                                        style={{
                                                            aspectRatio: '3/4',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-medium">
                                                    {book.title}
                                                </span>
                                                {book.images.length > 1 && (
                                                    <p className="text-xs text-muted-foreground">
                                                        +
                                                        {book.images.length - 1}{' '}
                                                        more images
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="max-w-xs p-4">
                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {book.description}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-semibold">
                                            Rp{' '}
                                            {Number(book.price).toLocaleString(
                                                'id-ID',
                                            )}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <Badge
                                            variant="outline"
                                            className={`${getConditionColor(book.condition)} border font-medium`}
                                        >
                                            {formatCondition(book.condition)}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Badge
                                            variant="outline"
                                            className={`${getStatusColor(book.status)} border font-medium capitalize`}
                                        >
                                            {book.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {book.seller_name}
                                    </td>
                                    <td className="p-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Actions
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => onEdit(book)}
                                                >
                                                    <Edit2 className="mr-2 h-4 w-4" />
                                                    Edit Book
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        onDelete(book)
                                                    }
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Book
                                                </DropdownMenuItem>

                                                {book.status !== 'booked' && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                openStatusDialog(
                                                                    book,
                                                                )
                                                            }
                                                        >
                                                            {book.status ===
                                                            'available' ? (
                                                                <>
                                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                    Mark as Sold
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                                    Mark
                                                                    Available
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {books.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No books found.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * perPage + 1} to{' '}
                        {Math.min(currentPage * perPage, totalItems)} of{' '}
                        {totalItems} results
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <Button
                                key={page}
                                variant={
                                    page === currentPage ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={lightboxSlides}
            />

            {/* Status Toggle Confirmation Dialog */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Status Change</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to mark "{bookToToggle?.title}
                            " as{' '}
                            <strong className="capitalize">{newStatus}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setStatusDialogOpen(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmToggleStatus}
                            disabled={isProcessing}
                        >
                            {isProcessing && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
