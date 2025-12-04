<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    // Status constants
    const STATUS_AVAILABLE = 'available';
    const STATUS_BOOKED = 'booked';
    const STATUS_SOLD = 'sold';

    protected $fillable = [
        'seller_id',
        'title',
        'description',
        'price',
        'condition',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }

    /**
     * Get the seller (user) that owns the book.
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the images for the book.
     */
    public function images()
    {
        return $this->hasMany(BookImage::class, 'book_id');
    }

    /**
     * Get the order items for the book.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'book_id');
    }

    /**
     * Get active orders for the book (orders that affect availability).
     */
    public function activeOrders()
    {
        return $this->hasManyThrough(Order::class, OrderItem::class, 'book_id', 'id', 'id', 'order_id')
            ->whereIn('status', ['pending_payment', 'waiting_confirmation', 'processing', 'shipped', 'completed']);
    }

    /**
     * Check if book is available for purchase.
     */
    public function isAvailable(): bool
    {
        return $this->status === self::STATUS_AVAILABLE;
    }

    /**
     * Update book status based on current orders.
     */
    public function updateStatusBasedOnOrders(): void
    {
        // Get the latest order for this book
        $latestOrder = $this->hasManyThrough(Order::class, OrderItem::class, 'book_id', 'id', 'id', 'order_id')
            ->latest()
            ->first();

        if (!$latestOrder) {
            $this->update(['status' => self::STATUS_AVAILABLE]);
            return;
        }

        // Determine status based on order status
        $newStatus = match ($latestOrder->status) {
            'pending_payment', 'waiting_confirmation' => self::STATUS_BOOKED,
            'processing', 'shipped', 'completed' => self::STATUS_SOLD,
            'cancelled', 'payment_rejected' => self::STATUS_AVAILABLE,
            default => $this->status, // Keep current status if unknown
        };

        $this->update(['status' => $newStatus]);
    }
}
