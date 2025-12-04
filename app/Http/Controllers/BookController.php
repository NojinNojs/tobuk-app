<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of books for public viewing.
     */
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

        return Inertia::render('books', [
            'books' => ['data' => $books],
        ]);
    }

    /**
     * Display the specified book.
     */
    public function show(string $id)
    {
        $book = Book::with(['images', 'seller:id,name'])->findOrFail($id);

        return Inertia::render('book-detail', [
            'book' => [
                'id' => $book->id,
                'title' => $book->title,
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
            ],
        ]);
    }
    /**
     * Display the homepage with latest books.
     */
    public function home()
    {
        $latestBooks = Book::with(['images', 'seller:id,name'])
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
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

        return Inertia::render('home', [
            'latestBooks' => $latestBooks
        ]);
    }
}
