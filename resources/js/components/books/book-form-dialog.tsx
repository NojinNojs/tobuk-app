import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ImageCropper } from '@/components/ui/image-cropper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Book } from '@/types/book';
import { useForm } from '@inertiajs/react';
import { Upload, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface BookFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    book?: Book | null;
    mode: 'create' | 'edit';
}

export function BookFormDialog({
    open,
    onOpenChange,
    book,
    mode,
}: BookFormDialogProps) {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);
    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const [cropOpen, setCropOpen] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        transform,
        clearErrors,
    } = useForm<{
        title: string;
        description: string;
        price: string;
        condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
        images: File[];
        delete_images: number[];
        _method?: string;
    }>({
        title: '',
        description: '',
        price: '',
        condition: 'new',
        images: [],
        delete_images: [],
    });

    // Reset state when dialog opens (transition from closed to open)
    useEffect(() => {
        if (!open) {
            // Clean up previews when dialog closes
            imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
            return;
        }

        // Dialog just opened - reset form
        clearErrors();
        setImagePreviews([]);
        setDeleteImageIds([]);

        if (mode === 'edit' && book) {
            setData({
                title: book.title,
                description: book.description,
                price: book.price.toString(),
                condition: book.condition as
                    | 'new'
                    | 'like_new'
                    | 'good'
                    | 'fair'
                    | 'poor',
                images: [],
                delete_images: [],
            });
        } else {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, book?.id]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const maxImages = 5;
            const currentImageCount =
                mode === 'edit' && book
                    ? book.images.length - deleteImageIds.length
                    : 0;
            const newImageCount = data.images.length;
            const remainingSlots =
                maxImages - currentImageCount - newImageCount;

            if (remainingSlots <= 0) {
                toast.error(`Maximum ${maxImages} images allowed.`);
                return;
            }

            // Take only the first file for cropping (one by one for now to keep it simple)
            const file = acceptedFiles[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setCroppingImage(reader.result as string);
                    setCropOpen(true);
                };
                reader.readAsDataURL(file);
            }
        },
        [book, deleteImageIds.length, mode, data.images.length],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
        maxFiles: 1, // Process one at a time for cropping
    });

    const handleCropComplete = (croppedBlob: Blob) => {
        const file = new File([croppedBlob], `image-${Date.now()}.webp`, {
            type: 'image/webp',
        });

        setData('images', [...data.images, file]);
        setImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
        setCroppingImage(null);
    };

    const removeNewImage = (index: number) => {
        const newImages = [...data.images];
        newImages.splice(index, 1);
        setData('images', newImages);

        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url =
            mode === 'create' ? '/admin/books' : `/admin/books/${book?.id}`;

        transform((data) => ({
            ...data,
            delete_images: deleteImageIds,
            _method: mode === 'edit' ? 'PUT' : undefined,
        }));

        post(url, {
            forceFormData: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
                setImagePreviews([]);
                setDeleteImageIds([]);
            },
        });
    };

    const toggleDeleteImage = (imageId: number) => {
        setDeleteImageIds((prev) =>
            prev.includes(imageId)
                ? prev.filter((id) => id !== imageId)
                : [...prev, imageId],
        );
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {mode === 'create'
                                    ? 'Add New Book'
                                    : 'Edit Book'}
                            </DialogTitle>
                            <DialogDescription>
                                {mode === 'create'
                                    ? 'Add a new book to your inventory. Upload up to 5 images.'
                                    : 'Update book information and images.'}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {/* Title */}
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={4}
                                    required
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Price */}
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (Rp)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData('price', e.target.value)
                                    }
                                    required
                                />
                                {errors.price && (
                                    <p className="text-sm text-destructive">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* Condition */}
                            <div className="grid gap-2">
                                <Label htmlFor="condition">Condition</Label>
                                <Select
                                    value={data.condition}
                                    onValueChange={(value) =>
                                        setData(
                                            'condition',
                                            value as
                                                | 'new'
                                                | 'like_new'
                                                | 'good'
                                                | 'fair'
                                                | 'poor',
                                        )
                                    }
                                >
                                    <SelectTrigger id="condition">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="like_new">
                                            Like New
                                        </SelectItem>
                                        <SelectItem value="good">
                                            Good
                                        </SelectItem>
                                        <SelectItem value="fair">
                                            Fair
                                        </SelectItem>
                                        <SelectItem value="poor">
                                            Poor
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.condition && (
                                    <p className="text-sm text-destructive">
                                        {errors.condition}
                                    </p>
                                )}
                            </div>

                            {/* Existing Images (Edit mode only) */}
                            {mode === 'edit' &&
                                book &&
                                book.images.length > 0 && (
                                    <div className="grid gap-2">
                                        <Label>Current Images</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {book.images.map((image) => (
                                                <div
                                                    key={image.id}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt="Book"
                                                        className={`h-24 w-full rounded object-cover ${
                                                            deleteImageIds.includes(
                                                                image.id,
                                                            )
                                                                ? 'opacity-50'
                                                                : ''
                                                        }`}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant={
                                                            deleteImageIds.includes(
                                                                image.id,
                                                            )
                                                                ? 'default'
                                                                : 'destructive'
                                                        }
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6"
                                                        onClick={() =>
                                                            toggleDeleteImage(
                                                                image.id,
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            {/* Upload Images */}
                            <div className="grid gap-2">
                                <Label>
                                    {mode === 'edit'
                                        ? 'Add New Images'
                                        : 'Images'}
                                </Label>
                                <div
                                    {...getRootProps()}
                                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                                        isDragActive
                                            ? 'border-primary bg-primary/10'
                                            : 'border-muted-foreground/25 hover:border-primary'
                                    }`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                                        <div className="rounded-full bg-background p-2 shadow-sm">
                                            <Upload className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="text-sm font-medium">
                                            {isDragActive
                                                ? 'Drop the image here'
                                                : 'Drag & drop or click to upload'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Supports: PNG, JPG, WEBP (Max 5MB)
                                        </div>
                                    </div>
                                </div>

                                {errors.images && (
                                    <p className="text-sm text-destructive">
                                        {errors.images}
                                    </p>
                                )}

                                {/* New Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-24 w-full rounded object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6"
                                                    onClick={() =>
                                                        removeNewImage(index)
                                                    }
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    onOpenChange(false);
                                    setImagePreviews([]);
                                    setDeleteImageIds([]);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? mode === 'create'
                                        ? 'Adding...'
                                        : 'Saving...'
                                    : mode === 'create'
                                      ? 'Add Book'
                                      : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {croppingImage && (
                <ImageCropper
                    image={croppingImage}
                    open={cropOpen}
                    onOpenChange={setCropOpen}
                    onCropComplete={handleCropComplete}
                    aspectRatio={3 / 4}
                />
            )}
        </>
    );
}
