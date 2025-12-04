<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['customer', 'paymentProof', 'orderItems.book.images'])
            ->latest()
            ->paginate(10)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'customer' => $order->customer,
                    'order_date' => $order->order_date,
                    'total' => $order->total,
                    'status' => $order->status,
                    'order_items' => $order->orderItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'book' => [
                                'title' => $item->book->title,
                                'images' => $item->book->images->map(function ($img) {
                                    return [
                                        'url' => asset($img->image_url)
                                    ];
                                })
                            ]
                        ];
                    }),
                ];
            });

        return Inertia::render('admin/orders/index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'orderItems.book.images', 'paymentProof']);

        return Inertia::render('admin/orders/show', [
            'order' => [
                'id' => $order->id,
                'order_date' => $order->order_date,
                'status' => $order->status,
                'total' => $order->total,
                'customer_id' => $order->customer_id,
                'shipping_name' => $order->shipping_name,
                'shipping_phone' => $order->shipping_phone,
                'shipping_address' => $order->shipping_address,
                'shipping_method' => $order->shipping_method,
                'tracking_number' => $order->tracking_number,
                'unique_code' => $order->unique_code,
                'payment_deadline' => $order->payment_deadline,
                'customer' => [
                    'id' => $order->customer->id,
                    'name' => $order->customer->name,
                    'email' => $order->customer->email,
                ],
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
                    'verified_at' => $order->paymentProof->verified_at,
                ] : null
            ]
        ]);
    }

    public function verify(Request $request, Order $order)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'notes' => 'nullable|string',
        ]);

        if ($request->action === 'approve') {
            $order->update(['status' => 'processing']);
            $order->paymentProof()->update([
                'verified_at' => now(),
                'verified_by' => auth()->id(),
            ]);

            // Update book status to sold
            foreach ($order->orderItems as $item) {
                $item->book->update(['status' => Book::STATUS_SOLD]);
            }
        } else {
            $order->update(['status' => 'payment_rejected']);
            $order->paymentProof()->update([
                'notes' => $request->notes,
                'verified_at' => now(),
                'verified_by' => auth()->id(),
            ]);

            // Update book status back to available
            foreach ($order->orderItems as $item) {
                $item->book->updateStatusBasedOnOrders();
            }
        }

        return back()->with('success', 'Payment verification updated.');
    }

    public function ship(Request $request, Order $order)
    {
        $request->validate([
            'tracking_number' => 'required|string',
            'shipping_method' => 'required|string',
        ]);

        $order->update([
            'status' => 'shipped',
            'tracking_number' => $request->tracking_number,
            'shipping_method' => $request->shipping_method,
        ]);

        return back()->with('success', 'Order marked as shipped.');
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending_payment,waiting_confirmation,paid,processing,shipped,completed,cancelled,payment_rejected',
        ]);

        $order->update(['status' => $request->status]);

        return back()->with('success', 'Order status updated successfully.');
    }
}
