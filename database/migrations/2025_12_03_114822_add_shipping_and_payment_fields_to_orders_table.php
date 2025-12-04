<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('shipping_name')->nullable();
            $table->string('shipping_phone', 20)->nullable();
            $table->text('shipping_address')->nullable();
            $table->string('shipping_method', 50)->nullable();
            $table->string('tracking_number', 100)->nullable();
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->integer('unique_code')->nullable();
            $table->timestamp('payment_deadline')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_name',
                'shipping_phone',
                'shipping_address',
                'shipping_method',
                'tracking_number',
                'shipping_cost',
                'unique_code',
                'payment_deadline'
            ]);
        });
    }
};
