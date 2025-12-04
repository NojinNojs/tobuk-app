<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Auth::user()->orders()
            ->with(['orderItems.book.images'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_date' => $order->order_date,
                    'status' => $order->status,
                    'total' => $order->total,
                    'order_items' => $order->orderItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'book' => [
                                'id' => $item->book->id,
                                'title' => $item->book->title,
                                'images' => $item->book->images->map(fn($img) => [
                                    'id' => $img->id,
                                    'url' => asset($img->image_url)
                                ])->values()->all()
                            ]
                        ];
                    })->values()->all()
                ];
            });

        return Inertia::render('orders/index', [
            'orders' => $orders
        ]);
    }

    public function create(Request $request)
    {
        // Validate if user has profile info
        $user = Auth::user();
        if (!$user->full_name || !$user->phone || !$user->address) {
            return redirect()->route('profile.edit')->with('error', 'Please complete your profile first.');
        }

        $bookId = $request->query('book_id');
        $book = Book::with('images')->findOrFail($bookId);

        return Inertia::render('checkout', [
            'book' => [
                'id' => $book->id,
                'title' => $book->title,
                'description' => $book->description,
                'price' => $book->price,
                'condition' => $book->condition,
                'status' => $book->status,
                'images' => $book->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => asset($img->image_url)
                ]),
            ],
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1',
            'shipping_name' => 'required|string',
            'shipping_phone' => 'required|string',
            'shipping_address' => 'required|string',
        ]);

        DB::beginTransaction();
        try {
            // Lock the book row for update to prevent race conditions
            $book = Book::where('id', $request->book_id)->lockForUpdate()->firstOrFail();

            // Check if book is available
            if (!$book->isAvailable()) {
                DB::rollBack();
                return back()->with(
                    'error',
                    'This book is no longer available. It may have already been purchased or is currently reserved.'
                );
            }

            $total = $book->price * $request->quantity;

            // Generate unique code (last 3 digits)
            $uniqueCode = rand(1, 999);
            $totalWithCode = $total + $uniqueCode;

            $order = Order::create([
                'customer_id' => Auth::id(),
                'order_date' => now(),
                'status' => 'pending_payment',
                'total' => $totalWithCode,
                'shipping_name' => $request->shipping_name,
                'shipping_phone' => $request->shipping_phone,
                'shipping_address' => $request->shipping_address,
                'shipping_method' => 'Free Shipping', // Default for now
                'shipping_cost' => 0,
                'unique_code' => $uniqueCode,
                'payment_deadline' => now()->addHours(24),
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'book_id' => $book->id,
                'quantity' => $request->quantity,
                'price' => $book->price,
            ]);

            // Update book status to booked
            $book->update(['status' => Book::STATUS_BOOKED]);

            DB::commit();

            return redirect()->route('orders.show', $order->id);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to create order.');
        }
    }

    public function show(Order $order)
    {
        if ($order->customer_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['orderItems.book.images', 'paymentProof']);

        return Inertia::render('orders/show', [
            'order' => [
                'id' => $order->id,
                'order_date' => $order->order_date,
                'status' => $order->status,
                'total' => $order->total,
                'shipping_name' => $order->shipping_name,
                'shipping_phone' => $order->shipping_phone,
                'shipping_address' => $order->shipping_address,
                'shipping_method' => $order->shipping_method,
                'tracking_number' => $order->tracking_number,
                'unique_code' => $order->unique_code,
                'payment_deadline' => $order->payment_deadline,
                'order_items' => $order->orderItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'book' => [
                            'id' => $item->book->id,
                            'title' => $item->book->title,
                            'images' => $item->book->images->map(fn($img) => [
                                'id' => $img->id,
                                'url' => asset($img->image_url)
                            ])->values()->all()
                        ]
                    ];
                })->values()->all(),
                'payment_proof' => $order->paymentProof ? [
                    'id' => $order->paymentProof->id,
                    'proof_image_url' => $order->paymentProof->proof_image_url,
                    'uploaded_at' => $order->paymentProof->uploaded_at,
                    'sender_account_number' => $order->paymentProof->sender_account_number,
                    'notes' => $order->paymentProof->notes,
                ] : null
            ]
        ]);
    }
    public function cancel(Order $order)
    {
        if ($order->customer_id !== Auth::id()) {
            abort(403);
        }

        if (in_array($order->status, ['shipped', 'completed', 'cancelled'])) {
            return back()->with('error', 'Order cannot be cancelled.');
        }

        $order->update(['status' => 'cancelled']);

        // Update book status back to available
        foreach ($order->orderItems as $item) {
            $item->book->updateStatusBasedOnOrders();
        }

        return back()->with('success', 'Order cancelled successfully.');
    }
}
