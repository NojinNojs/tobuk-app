import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, Home } from 'lucide-react';

export default function ServiceUnavailable() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Head title="503 - Layanan Tidak Tersedia" />
            
            <div className="text-center">
                {/* Maintenance Book Illustration */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-48 w-48 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-500 shadow-2xl dark:from-yellow-600 dark:to-amber-700">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BookOpen className="h-24 w-24 text-white" />
                            </div>
                        </div>
                        {/* Clock icon */}
                        <div className="absolute -right-4 top-0 animate-pulse">
                            <Clock className="h-12 w-12 text-yellow-500 dark:text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <h1 className="mb-4 text-8xl font-bold text-yellow-600 dark:text-yellow-400">
                    503
                </h1>
                <h2 className="mb-4 text-3xl font-semibold text-gray-800 dark:text-gray-200">
                    Perpustakaan Sedang Ditutup untuk Perawatan! 🔧
                </h2>
                <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
                    Maaf, perpustakaan kami sedang dalam perawatan untuk memberikan 
                    pengalaman membaca yang lebih baik. Kami akan kembali segera!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/">
                            <Home className="h-5 w-5" />
                            Kembali ke Beranda
                        </Link>
                    </Button>
                </div>

                {/* Fun Quote */}
                <div className="mt-12 rounded-lg bg-white/50 p-6 shadow-lg dark:bg-gray-800/50">
                    <p className="text-sm italic text-gray-700 dark:text-gray-300">
                        "Perpustakaan terbaik adalah yang selalu diperbarui. 
                        Kami sedang menyiapkan sesuatu yang istimewa untuk Anda!" 
                        <span className="block mt-2 text-xs">- ToBuk Maintenance</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

