import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Head title="404 - Halaman Tidak Ditemukan" />
            
            <div className="text-center">
                {/* Book Illustration */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-48 w-48 animate-bounce rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 shadow-2xl dark:from-orange-600 dark:to-amber-700">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BookOpen className="h-24 w-24 text-white" />
                            </div>
                        </div>
                        {/* Flying pages */}
                        <div className="absolute -right-8 top-4 h-8 w-8 animate-pulse rounded bg-white/80 shadow-lg dark:bg-gray-700"></div>
                        <div className="absolute -left-8 bottom-8 h-6 w-6 animate-pulse rounded bg-white/60 shadow-lg dark:bg-gray-700"></div>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="mb-4 text-8xl font-bold text-orange-600 dark:text-orange-400">
                    404
                </h1>
                <h2 className="mb-4 text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Halaman Ini Sepertinya Terjilid di Buku Lain! 📚
                </h2>
                <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
                    Maaf, halaman yang Anda cari tidak ditemukan di perpustakaan kami. 
                    Mungkin buku yang Anda cari sedang dipinjam atau belum tersedia.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/">
                            <Home className="h-5 w-5" />
                            Kembali ke Beranda
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2">
                        <Link href="/dashboard">
                            <Search className="h-5 w-5" />
                            Cari Buku Lain
                        </Link>
                    </Button>
                </div>

                {/* Fun Quote */}
                <div className="mt-12 rounded-lg bg-white/50 p-6 shadow-lg dark:bg-gray-800/50">
                    <p className="text-sm italic text-gray-700 dark:text-gray-300">
                        "Buku yang hilang adalah harta karun yang menunggu untuk ditemukan kembali" 
                        <span className="block mt-2 text-xs">- ToBuk Library</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

