<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PaymentProof;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PaymentProofController extends Controller
{
    public function store(Request $request, Order $order)
    {
        if ($order->customer_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'proof_image' => 'required|image|max:2048', // 2MB max
            'sender_account_number' => 'nullable|string|max:50',
        ]);

        $file = $request->file('proof_image');

        if (!$file || !$file->isValid()) {
            \Log::error('Payment proof upload failed: Invalid file.', ['file' => $file]);
            return back()->withErrors(['proof_image' => 'File upload failed. Please try again.']);
        }

        try {
            $filename = $file->hashName();
            $destinationPath = public_path('images/payment-proofs');

            // Ensure directory exists
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $filename);
            $path = 'images/payment-proofs/' . $filename;
        } catch (\Throwable $e) {
            \Log::error('Payment proof storage failed: ' . $e->getMessage());
            throw $e;
        }

        PaymentProof::create([
            'order_id' => $order->id,
            'proof_image_url' => $path,
            'sender_account_number' => $request->sender_account_number,
        ]);

        $order->update(['status' => 'waiting_confirmation']);

        return redirect()->route('orders.show', $order->id)->with('success', 'Payment proof uploaded successfully.');
    }
}
