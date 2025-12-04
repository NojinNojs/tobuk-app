import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { BookX, Home, RefreshCw } from 'lucide-react';

export default function ServerError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Head title="500 - Server Error" />
            
            <div className="text-center">
                {/* Broken Book Illustration */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-48 w-48 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-500 shadow-2xl dark:from-purple-600 dark:to-indigo-700">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BookX className="h-24 w-24 text-white" />
                            </div>
                        </div>
                        {/* Falling pages */}
                        <div className="absolute -right-8 top-8 h-6 w-6 animate-bounce rounded bg-white/80 shadow-lg dark:bg-gray-700" style={{ animationDelay: '0s' }}></div>
                        <div className="absolute -left-8 top-16 h-4 w-4 animate-bounce rounded bg-white/60 shadow-lg dark:bg-gray-700" style={{ animationDelay: '0.2s' }}></div>
                        <div className="absolute right-4 -bottom-4 h-5 w-5 animate-bounce rounded bg-white/70 shadow-lg dark:bg-gray-700" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="mb-4 text-8xl font-bold text-purple-600 dark:text-purple-400">
                    500
                </h1>
                <h2 className="mb-4 text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Halaman Buku Sedang Rusak! 📖💥
                </h2>
                <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
                    Ups! Terjadi kesalahan di server kami. Sepertinya ada masalah teknis 
                    yang membuat halaman buku ini tidak bisa dibuka. Tim kami sedang memperbaikinya!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/">
                            <Home className="h-5 w-5" />
                            Kembali ke Beranda
                        </Link>
                    </Button>
                    <Button 
                        asChild 
                        variant="outline" 
                        size="lg" 
                        className="gap-2"
                        onClick={() => window.location.reload()}
                    >
                        <Link href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
                            <RefreshCw className="h-5 w-5" />
                            Coba Lagi
                        </Link>
                    </Button>
                </div>

                {/* Fun Quote */}
                <div className="mt-12 rounded-lg bg-white/50 p-6 shadow-lg dark:bg-gray-800/50">
                    <p className="text-sm italic text-gray-700 dark:text-gray-300">
                        "Bahkan buku terbaik pun kadang perlu diperbaiki. 
                        Tim kami sedang bekerja keras untuk memperbaikinya!" 
                        <span className="block mt-2 text-xs">- ToBuk Maintenance Team</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

