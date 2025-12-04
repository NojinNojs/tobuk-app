import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { BookLock, Home, Shield } from 'lucide-react';

export default function Forbidden() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Head title="403 - Akses Ditolak" />
            
            <div className="text-center">
                {/* Locked Book Illustration */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-48 w-48 rounded-lg bg-gradient-to-br from-red-400 to-rose-500 shadow-2xl dark:from-red-600 dark:to-rose-700">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BookLock className="h-24 w-24 text-white" />
                            </div>
                        </div>
                        {/* Lock icon */}
                        <div className="absolute -right-4 top-0 animate-bounce">
                            <Shield className="h-12 w-12 text-red-500 dark:text-red-400" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="mb-4 text-8xl font-bold text-red-600 dark:text-red-400">
                    403
                </h1>
                <h2 className="mb-4 text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Buku Ini Terkunci di Rak Khusus! 🔒
                </h2>
                <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
                    Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. 
                    Buku ini hanya bisa dibaca oleh admin atau pengguna dengan akses khusus.
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
                            <BookLock className="h-5 w-5" />
                            Lihat Buku yang Tersedia
                        </Link>
                    </Button>
                </div>

                {/* Fun Quote */}
                <div className="mt-12 rounded-lg bg-white/50 p-6 shadow-lg dark:bg-gray-800/50">
                    <p className="text-sm italic text-gray-700 dark:text-gray-300">
                        "Beberapa buku membutuhkan kunci khusus untuk dibuka. 
                        Pastikan Anda memiliki izin yang tepat!" 
                        <span className="block mt-2 text-xs">- ToBuk Security</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

