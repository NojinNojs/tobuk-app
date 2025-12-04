<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookImage extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'book_id',
        'image_url',
    ];

    protected $appends = ['url'];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    /**
     * Get the image URL (accessor for frontend compatibility).
     */
    public function getUrlAttribute(): string
    {
        return $this->image_url;
    }

    /**
     * Get the book that owns the image.
     */
    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id');
    }
}
