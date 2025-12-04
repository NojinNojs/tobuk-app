<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BookStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_book_status_flow()
    {
        // 1. Setup: Create users and a book
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);
        $seller = User::factory()->create(['role' => 'customer']);

        $book = Book::create([
            'seller_id' => $seller->id,
            'title' => 'Test Book',
            'description' => 'Description',
            'price' => 100000,
            'condition' => 'new',
            'status' => 'available',
        ]);

        // 2. Order Creation -> Booked
        $response = $this->actingAs($customer)->post(route('orders.store'), [
            'book_id' => $book->id,
            'quantity' => 1,
            'shipping_name' => 'Test User',
            'shipping_phone' => '08123456789',
            'shipping_address' => 'Test Address',
        ]);

        $response->assertRedirect();
        $this->assertEquals('booked', $book->fresh()->status);

        $order = Order::first();
        $this->assertEquals('pending_payment', $order->status);

        // 3. Payment Proof Upload -> Still Booked
        Storage::fake('public');
        $file = UploadedFile::fake()->image('proof.jpg');

        $response = $this->actingAs($customer)->post(route('payment-proof.store', $order), [
            'proof_image' => $file,
            'sender_account_number' => '1234567890',
        ]);

        $response->assertRedirect();
        $this->assertEquals('waiting_confirmation', $order->fresh()->status);
        $this->assertEquals('booked', $book->fresh()->status);

        // 4. Admin Approves -> Sold
        $response = $this->actingAs($admin)->post(route('admin.orders.verify', $order), [
            'action' => 'approve',
        ]);

        $response->assertRedirect();
        $this->assertEquals('processing', $order->fresh()->status);
        $this->assertEquals('sold', $book->fresh()->status);

        // 5. Admin Manually Toggles Status -> Available
        $response = $this->actingAs($admin)->patch(route('admin.books.toggle-status', $book), [
            'status' => 'available',
        ]);

        $response->assertRedirect();
        $this->assertEquals('available', $book->fresh()->status);
    }

    public function test_order_cancellation_restores_availability()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $seller = User::factory()->create(['role' => 'customer']);

        $book = Book::create([
            'seller_id' => $seller->id,
            'title' => 'Test Book',
            'description' => 'Description',
            'price' => 100000,
            'condition' => 'new',
            'status' => 'available',
        ]);

        // Create Order
        $this->actingAs($customer)->post(route('orders.store'), [
            'book_id' => $book->id,
            'quantity' => 1,
            'shipping_name' => 'Test User',
            'shipping_phone' => '08123456789',
            'shipping_address' => 'Test Address',
        ]);

        $this->assertEquals('booked', $book->fresh()->status);
        $order = Order::first();

        // Cancel Order
        $this->actingAs($customer)->post(route('orders.cancel', $order));

        $this->assertEquals('cancelled', $order->fresh()->status);
        $this->assertEquals('available', $book->fresh()->status);
    }

    public function test_cannot_order_booked_book()
    {
        $customer1 = User::factory()->create(['role' => 'customer']);
        $customer2 = User::factory()->create(['role' => 'customer']);
        $seller = User::factory()->create(['role' => 'customer']);

        $book = Book::create([
            'seller_id' => $seller->id,
            'title' => 'Test Book',
            'description' => 'Description',
            'price' => 100000,
            'condition' => 'new',
            'status' => 'booked', // Already booked
        ]);

        // Try to order
        $response = $this->actingAs($customer2)->post(route('orders.store'), [
            'book_id' => $book->id,
            'quantity' => 1,
            'shipping_name' => 'Test User',
            'shipping_phone' => '08123456789',
            'shipping_address' => 'Test Address',
        ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseCount('orders', 0);
    }
}
