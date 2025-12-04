import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { type Book } from '@/types/book';
import { router } from '@inertiajs/react';

interface DeleteBookDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    book: Book | null;
}

export function DeleteBookDialog({
    open,
    onOpenChange,
    book,
}: DeleteBookDialogProps) {
    const handleDelete = () => {
        if (book) {
            router.delete(`/admin/books/${book.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Book</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{' '}
                        <strong>{book?.title}</strong>? This action cannot be
                        undone and will delete all associated images.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete Book
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
