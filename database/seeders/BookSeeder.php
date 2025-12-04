<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\User;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users to assign as sellers
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please create users first.');
            return;
        }

        $books = [
            [
                'title' => 'Laskar Pelangi',
                'description' => 'Novel karya Andrea Hirata yang menceritakan kisah persahabatan sepuluh anak pinggiran Belitung yang penuh dengan mimpi dan perjuangan.',
                'price' => 85000,
                'condition' => 'new',
            ],
            [
                'title' => 'Bumi Manusia',
                'description' => 'Novel pertama dari Tetralogi Buru karya Pramoedya Ananta Toer yang mengisahkan perjalanan Minke, seorang pribumi Jawa dalam zaman kolonial.',
                'price' => 95000,
                'condition' => 'like_new',
            ],
            [
                'title' => 'Sapiens: A Brief History of Humankind',
                'description' => 'Yuval Noah Harari explores how Homo sapiens came to dominate the world through cognitive, agricultural, and scientific revolutions.',
                'price' => 125000,
                'condition' => 'new',
            ],
            [
                'title' => 'Atomic Habits',
                'description' => 'James Clear reveals practical strategies for forming good habits, breaking bad ones, and mastering the tiny behaviors that lead to remarkable results.',
                'price' => 110000,
                'condition' => 'like_new',
            ],
            [
                'title' => 'Sang Pemimpi',
                'description' => 'Sekuel Laskar Pelangi yang menceritakan perjalanan Ikal dan teman-temannya mengejar mimpi melanjutkan pendidikan di Eropa.',
                'price' => 75000,
                'condition' => 'good',
            ],
            [
                'title' => 'Harry Potter and the Philosopher\'s Stone',
                'description' => 'The first book in J.K. Rowling\'s magical series about a young wizard discovering his destiny at Hogwarts School.',
                'price' => 135000,
                'condition' => 'new',
            ],
            [
                'title' => 'Dilan: Dia adalah Dilanku Tahun 1990',
                'description' => 'Novel romantis karya Pidi Baiq tentang kisah cinta SMA di Bandung yang penuh dengan kata-kata manis dan nostalgia.',
                'price' => 65000,
                'condition' => 'fair',
            ],
            [
                'title' => 'The Lean Startup',
                'description' => 'Eric Ries presents a scientific approach to creating and managing successful startups in an age of uncertainty.',
                'price' => 98000,
                'condition' => 'good',
            ],
            [
                'title' => 'Negeri 5 Menara',
                'description' => 'Novel inspiratif Ahmad Fuadi tentang perjuangan santri di Pondok Madani Ponorogo yang penuh motivasi dan persahabatan.',
                'price' => 88000,
                'condition' => 'like_new',
            ],
            [
                'title' => 'The Psychology of Money',
                'description' => 'Morgan Housel explores the strange ways people think about money and teaches you how to make better sense of financial decisions.',
                'price' => 115000,
                'condition' => 'new',
            ],
            [
                'title' => 'Perahu Kertas',
                'description' => 'Novel Dee Lestari tentang Kugy dan Keenan yang mengejar mimpi mereka di tengah perjalanan cinta yang rumit.',
                'price' => 70000,
                'condition' => 'good',
            ],
            [
                'title' => '1984',
                'description' => 'George Orwell\'s dystopian masterpiece about totalitarianism, surveillance, and the power of individual thought.',
                'price' => 92000,
                'condition' => 'fair',
            ],
            [
                'title' => 'Filosofi Teras',
                'description' => 'Henry Manampiring menjelaskan filosofi Stoikisme dan bagaimana menerapkannya dalam kehidupan modern untuk hidup lebih tenang.',
                'price' => 95000,
                'condition' => 'new',
            ],
            [
                'title' => 'Clean Code',
                'description' => 'Robert C. Martin teaches the principles of writing clean, maintainable code that any programmer can read and understand.',
                'price' => 185000,
                'condition' => 'like_new',
            ],
            [
                'title' => 'Cantik Itu Luka',
                'description' => 'Novel magis realis Eka Kurniawan yang menceritakan kisah keluarga dan sejarah Indonesia dengan penuh kekerasan dan cinta.',
                'price' => 105000,
                'condition' => 'good',
            ],
            [
                'title' => 'Thinking, Fast and Slow',
                'description' => 'Daniel Kahneman reveals the two systems that drive the way we think and how we can harness slow thinking for better decisions.',
                'price' => 140000,
                'condition' => 'new',
            ],
            [
                'title' => 'Ayah',
                'description' => 'Novel Andrea Hirata yang mengharukan tentang seorang anak yang kehilangan ayahnya dan perjuangan keluarga menghadapi kehidupan.',
                'price' => 78000,
                'condition' => 'fair',
            ],
            [
                'title' => 'Design Patterns',
                'description' => 'Gang of Four\'s classic text on software design patterns that every developer should know.',
                'price' => 195000,
                'condition' => 'good',
            ],
            [
                'title' => 'Laut Bercerita',
                'description' => 'Leila S. Chudori mengangkat kisah kelam tentang aktivis yang hilang dan keluarga yang menunggu kepastian.',
                'price' => 98000,
                'condition' => 'like_new',
            ],
            [
                'title' => 'The 7 Habits of Highly Effective People',
                'description' => 'Stephen Covey presents a principle-centered approach for solving personal and professional problems.',
                'price' => 125000,
                'condition' => 'new',
            ],
            [
                'title' => 'Ronggeng Dukuh Paruk',
                'description' => 'Ahmad Tohari menceritakan tragedi seorang ronggeng bernama Srintil di tengah kekacauan politik tahun 1960-an.',
                'price' => 85000,
                'condition' => 'good',
            ],
            [
                'title' => 'To Kill a Mockingbird',
                'description' => 'Harper Lee\'s timeless novel about racial injustice and childhood innocence in the American South.',
                'price' => 88000,
                'condition' => 'fair',
            ],
            [
                'title' => 'Sebuah Seni untuk Bersikap Bodo Amat',
                'description' => 'Mark Manson memberikan pendekatan yang jujur dan lugas tentang cara hidup yang lebih baik dengan tidak terlalu peduli.',
                'price' => 89000,
                'condition' => 'like_new',
            ],
            [
                'title' => 'Eloquent JavaScript',
                'description' => 'Marijn Haverbeke\'s modern introduction to programming with JavaScript, from basics to advanced topics.',
                'price' => 165000,
                'condition' => 'new',
            ],
            [
                'title' => 'Hujan',
                'description' => 'Novel Tere Liye tentang petualangan magis dan persahabatan yang melampaui dunia paralel.',
                'price' => 92000,
                'condition' => 'good',
            ],
            [
                'title' => 'The Great Gatsby',
                'description' => 'F. Scott Fitzgerald\'s portrait of the Jazz Age, following the mysterious millionaire Jay Gatsby.',
                'price' => 75000,
                'condition' => 'poor',
            ],
            [
                'title' => 'Kata',
                'description' => 'Rintik Sedu memberikan kumpulan puisi dan kata-kata yang menyentuh hati tentang cinta, kehilangan, dan harapan.',
                'price' => 55000,
                'condition' => 'fair',
            ],
            [
                'title' => 'Deep Work',
                'description' => 'Cal Newport argues that the ability to focus without distraction is becoming increasingly valuable in our economy.',
                'price' => 105000,
                'condition' => 'like_new',
            ],
            [
                'title' => 'Gadis Kretek',
                'description' => 'Ratih Kumala mengisahkan tentang cinta, ambisi, dan industri kretek di Indonesia dengan latar belakang yang kaya.',
                'price' => 99000,
                'condition' => 'new',
            ],
            [
                'title' => 'Introduction to Algorithms',
                'description' => 'CLRS comprehensive textbook covering a broad range of algorithms in depth, the bible of computer science.',
                'price' => 250000,
                'condition' => 'like_new',
            ],
        ];

        foreach ($books as $bookData) {
            Book::create([
                'title' => $bookData['title'],
                'description' => $bookData['description'],
                'price' => $bookData['price'],
                'condition' => $bookData['condition'],
                'seller_id' => $users->random()->id,
            ]);
        }

        $this->command->info('Successfully created ' . count($books) . ' books!');
    }
}
