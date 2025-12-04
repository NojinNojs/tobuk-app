<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [\App\Http\Controllers\BookController::class, 'home'])->name('home');

// Public book browsing routes
Route::get('/books', [\App\Http\Controllers\BookController::class, 'index'])->name('books.index');
Route::get('/books/{id}', [\App\Http\Controllers\BookController::class, 'show'])->name('books.show');

Route::middleware(['auth', 'verified'])->group(function () {


    Route::get('under-construction', function () {
        return Inertia::render('under-construction');
    })->name('under-construction');

    // Order Routes
    Route::get('/checkout', [\App\Http\Controllers\OrderController::class, 'create'])->name('checkout');
    Route::post('/orders', [\App\Http\Controllers\OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [\App\Http\Controllers\OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/payment-proof', [\App\Http\Controllers\PaymentProofController::class, 'store'])->name('payment-proof.store');
    Route::post('/orders/{order}/cancel', [\App\Http\Controllers\OrderController::class, 'cancel'])->name('orders.cancel');
});

Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureUserIsAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->except(['show', 'create', 'edit']);
    Route::delete('books/bulk-destroy', [\App\Http\Controllers\Admin\BookController::class, 'bulkDestroy'])->name('books.bulk-destroy');
    Route::patch('books/{book}/toggle-status', [\App\Http\Controllers\Admin\BookController::class, 'toggleStatus'])->name('books.toggle-status');
    Route::resource('books', \App\Http\Controllers\Admin\BookController::class)->except(['show', 'create', 'edit']);

    // Admin Order Routes
    Route::resource('orders', \App\Http\Controllers\Admin\OrderController::class)->only(['index', 'show']);
    Route::post('orders/{order}/verify', [\App\Http\Controllers\Admin\OrderController::class, 'verify'])->name('orders.verify');
    Route::post('orders/{order}/ship', [\App\Http\Controllers\Admin\OrderController::class, 'ship'])->name('orders.ship');
    Route::patch('orders/{order}/status', [\App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('orders.update-status');
});

require __DIR__ . '/settings.php';
