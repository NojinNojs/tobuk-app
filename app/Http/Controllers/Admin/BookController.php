<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = Book::with(['images', 'seller:id,name'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author ?? '',
                    'isbn' => $book->isbn ?? '',
                    'description' => $book->description,
                    'price' => $book->price,
                    'condition' => $book->condition,
                    'status' => $book->status,
                    'seller_name' => $book->seller->name,
                    'images' => $book->images->map(fn($img) => [
                        'id' => $img->id,
                        'url' => asset($img->image_url)
                    ]),
                    'created_at' => $book->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('admin/books', [
            'books' => ['data' => $books],
        ]);
    }

    /**
     * Remove multiple books from storage.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:books,id',
        ]);

        $books = Book::whereIn('id', $request->ids)->get();

        foreach ($books as $book) {
            // Delete all associated images
            foreach ($book->images as $image) {
                $this->deleteImageFile($image->image_url);
            }
            $book->delete();
        }

        return redirect()->back()->with('success', 'Selected books deleted successfully!');
    }

    /**
     * Store a newly created book in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'condition' => 'required|string|in:new,like_new,good,fair,poor',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:webp,png,jpg,jpeg,gif|max:5120', // 5MB max
        ]);

        // Create book
        $book = Book::create([
            'seller_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'condition' => $validated['condition'],
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            try {
                $this->uploadImages($book, $request->file('images'));
            } catch (\Exception $e) {
                // If image upload fails, delete the book and return error
                $book->delete();
                return redirect()->back()
                    ->withErrors(['images' => 'Failed to upload images: ' . $e->getMessage()])
                    ->withInput();
            }
        }

        return redirect()->back()->with('success', 'Book created successfully!');
    }

    /**
     * Update the specified book in storage.
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'condition' => 'required|string|in:new,like_new,good,fair,poor',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:webp,png,jpg,jpeg,gif|max:5120', // 5MB max
            'delete_images' => 'nullable|array',
            'delete_images.*' => 'integer|exists:book_images,id',
        ]);

        // Update book
        $book->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'condition' => $validated['condition'],
        ]);

        // Delete specified images
        if ($request->has('delete_images') && is_array($request->delete_images)) {
            $imagesToDelete = BookImage::whereIn('id', $request->delete_images)
                ->where('book_id', $book->id)
                ->get();

            foreach ($imagesToDelete as $image) {
                $this->deleteImageFile($image->image_url);
                $image->delete();
            }
        }

        // Upload new images
        if ($request->hasFile('images')) {
            try {
                $this->uploadImages($book, $request->file('images'));
            } catch (\Exception $e) {
                return redirect()->back()
                    ->withErrors(['images' => 'Failed to upload images: ' . $e->getMessage()])
                    ->withInput();
            }
        }

        return redirect()->back()->with('success', 'Book updated successfully!');
    }

    /**
     * Remove the specified book from storage.
     */
    public function destroy(Book $book)
    {
        // Delete all associated images
        foreach ($book->images as $image) {
            $this->deleteImageFile($image->image_url);
        }

        // Delete book (images will be cascade deleted)
        $book->delete();

        return redirect()->back()->with('success', 'Book deleted successfully!');
    }

    /**
     * Toggle book status between available and sold.
     */
    public function toggleStatus(Request $request, Book $book)
    {
        $request->validate([
            'status' => 'required|in:available,sold',
        ]);

        // If changing to sold, ensure no active orders exist or handle accordingly
        // For simplicity, we just force the status change as this is an admin override
        $book->update(['status' => $request->status]);

        return back()->with('success', 'Book status updated successfully.');
    }

    /**
     * Upload images for a book.
     */
    private function uploadImages(Book $book, array $images)
    {
        $uploadPath = public_path('images/books');

        // Create directory if it doesn't exist
        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        foreach ($images as $image) {
            // Generate unique filename with .webp extension
            $filename = time() . '_' . Str::random(10) . '.webp';
            $fullPath = $uploadPath . '/' . $filename;

            // Get the temporary uploaded file path
            $sourcePath = $image->getPathname();

            // Convert image to WebP format
            $this->convertToWebP($sourcePath, $fullPath);

            // Save to database
            BookImage::create([
                'book_id' => $book->id,
                'image_url' => 'images/books/' . $filename,
            ]);
        }
    }

    /**
     * Convert image to WebP format.
     */
    private function convertToWebP(string $sourcePath, string $destinationPath, int $quality = 85)
    {
        // Validate source path
        if (empty($sourcePath) || !file_exists($sourcePath) || !is_readable($sourcePath)) {
            throw new \Exception('Invalid or unreadable source image path');
        }

        $imageInfo = @getimagesize($sourcePath);

        if ($imageInfo === false) {
            throw new \Exception('Unable to read image file');
        }

        $mimeType = $imageInfo['mime'];

        // Create image resource based on mime type
        switch ($mimeType) {
            case 'image/jpeg':
                $image = @imagecreatefromjpeg($sourcePath);
                break;
            case 'image/png':
                $image = @imagecreatefrompng($sourcePath);
                break;
            case 'image/gif':
                $image = @imagecreatefromgif($sourcePath);
                break;
            case 'image/webp':
                $image = @imagecreatefromwebp($sourcePath);
                break;
            default:
                throw new \Exception('Unsupported image type: ' . $mimeType);
        }

        if ($image === false) {
            throw new \Exception('Failed to create image resource from file');
        }

        // Convert to WebP
        $result = @imagewebp($image, $destinationPath, $quality);
        imagedestroy($image);

        if ($result === false) {
            throw new \Exception('Failed to convert image to WebP format');
        }
    }

    /**
     * Delete image file from storage.
     */
    private function deleteImageFile(string $imagePath)
    {
        $fullPath = public_path($imagePath);

        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }
}
