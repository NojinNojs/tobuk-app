import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    disabled?: boolean;
    badge?: string;
    exact?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Book {
    id: number;
    title: string;
    slug: string;
    description: string;
    price: number;
    condition: string;
    status: string;
    created_at: string;
    updated_at: string;
    images?: { id: number; url: string }[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    book_id: number;
    quantity: number;
    price: number;
    book: Book;
}

export interface PaymentProof {
    id: number;
    order_id: number;
    proof_image_url: string;
    sender_account_number: string | null;
    uploaded_at: string;
    verified_at: string | null;
    verified_by: number | null;
    notes: string | null;
}

export interface Order {
    id: number;
    customer_id: number;
    order_date: string;
    status:
        | 'pending_payment'
        | 'waiting_confirmation'
        | 'paid'
        | 'payment_rejected'
        | 'processing'
        | 'shipped'
        | 'completed'
        | 'cancelled';
    total: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_method: string | null;
    tracking_number: string | null;
    shipping_cost: number;
    unique_code: number;
    payment_deadline: string;
    customer: User;
    order_items: OrderItem[];
    payment_proof: PaymentProof | null;
}
