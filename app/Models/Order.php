<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_date',
        'status',
        'total',
        'customer_id',
        'shipping_name',
        'shipping_phone',
        'shipping_address',
        'shipping_method',
        'tracking_number',
        'shipping_cost',
        'unique_code',
        'payment_deadline',
    ];

    protected function casts(): array
    {
        return [
            'order_date' => 'datetime',
            'total' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'payment_deadline' => 'datetime',
        ];
    }

    /**
     * Get the payment proof for the order.
     */
    public function paymentProof()
    {
        return $this->hasOne(PaymentProof::class);
    }

    /**
     * Get the customer (user) that placed the order.
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Get the order items for the order.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
}
