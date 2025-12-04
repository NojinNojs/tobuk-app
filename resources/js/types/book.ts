export interface Book {
    id: number;
    title: string;
    author: string;
    isbn?: string;
    description: string;
    price: number;
    condition: string;
    status: 'available' | 'booked' | 'sold';
    seller_name: string;
    images: BookImage[];
    created_at: string;
}

export interface BookImage {
    id: number;
    url: string;
}
