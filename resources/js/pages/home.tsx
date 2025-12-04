import { BookCard } from '@/components/books/book-card';
import Marquee from '@/components/ui/marquee';
import UserLayout from '@/layouts/user-layout';
import { type Book } from '@/types/book';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Shield, TrendingUp } from 'lucide-react';

interface HomeProps {
    latestBooks: Book[];
}

export default function Home({ latestBooks }: HomeProps) {
    const genres = [
        'Fiction',
        'Mystery',
        'Romance',
        'Sci-Fi',
        'Biography',
        'History',
        'Self-Help',
        'Business',
        'Comics',
        'Art',
    ];

    return (
        <UserLayout>
            <Head title="Welcome to ToBuk" />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b py-24 sm:py-32">
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="mb-4 inline-block rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                            Curated Pre-loved Books Collection
                        </span>
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-7xl">
                            Discover Your Next <br />
                            <span className="text-zinc-500 dark:text-zinc-400">
                                Favorite Story
                            </span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                            Explore my carefully selected collection of quality
                            pre-loved books. Find your next great read at prices
                            you'll love.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href="/books"
                                className="inline-flex h-12 items-center justify-center rounded-md bg-foreground px-8 text-base font-medium text-background transition-colors hover:bg-foreground/90"
                            >
                                Browse My Collection
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 -z-10 h-full w-full opacity-20 dark:opacity-10">
                    <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-zinc-300 blur-3xl dark:bg-zinc-700" />
                    <div className="absolute right-10 bottom-20 h-40 w-40 rounded-full bg-zinc-300 blur-3xl dark:bg-zinc-700" />
                </div>
            </section>

            {/* Marquee Section */}
            <section className="border-b bg-white py-8 dark:bg-zinc-950">
                <Marquee pauseOnHover className="[--duration:30s]">
                    {genres.map((genre) => (
                        <div
                            key={genre}
                            className="mx-8 flex items-center gap-2 text-sm font-medium text-zinc-400 sm:text-xl dark:text-zinc-600"
                        >
                            <BookOpen className="h-4 w-4" />
                            {genre}
                        </div>
                    ))}
                </Marquee>
            </section>

            {/* Latest Books Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="mb-12 flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Latest Arrivals
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                                Freshly added books to my collection.
                            </p>
                        </div>
                        <Link
                            href="/books"
                            className="hidden items-center gap-2 text-sm font-medium hover:underline sm:flex"
                        >
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                        {latestBooks.map((book, index) => (
                            <motion.div
                                key={book.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                            >
                                <BookCard book={book} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center sm:hidden">
                        <Link
                            href="/books"
                            className="flex items-center gap-2 text-sm font-medium hover:underline"
                        >
                            View all books <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-y bg-zinc-50 py-12 sm:py-24 dark:bg-zinc-900/50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-6 sm:grid sm:grid-cols-3 sm:gap-12">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center"
                        >
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm sm:mb-6 sm:h-16 sm:w-16 sm:rounded-2xl dark:bg-zinc-800">
                                <BookOpen className="h-6 w-6 text-zinc-900 sm:h-8 sm:w-8 dark:text-zinc-100" />
                            </div>
                            <div>
                                <h3 className="mb-1 text-base font-semibold sm:mb-3 sm:text-lg">
                                    Quality Books
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Every book is carefully selected and
                                    verified for quality.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center"
                        >
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm sm:mb-6 sm:h-16 sm:w-16 sm:rounded-2xl dark:bg-zinc-800">
                                <TrendingUp className="h-6 w-6 text-zinc-900 sm:h-8 sm:w-8 dark:text-zinc-100" />
                            </div>
                            <div>
                                <h3 className="mb-1 text-base font-semibold sm:mb-3 sm:text-lg">
                                    Fair Prices
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Great reads at affordable prices, up to 70%
                                    off retail.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center"
                        >
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm sm:mb-6 sm:h-16 sm:w-16 sm:rounded-2xl dark:bg-zinc-800">
                                <Shield className="h-6 w-6 text-zinc-900 sm:h-8 sm:w-8 dark:text-zinc-100" />
                            </div>
                            <div>
                                <h3 className="mb-1 text-base font-semibold sm:mb-3 sm:text-lg">
                                    100% Original
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Authentic books guaranteed, no photocopies
                                    or fakes.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 px-6 py-16 text-center shadow-2xl sm:rounded-3xl sm:px-16 sm:py-24 dark:bg-zinc-800">
                        <div className="relative z-10 mx-auto max-w-2xl">
                            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                                Ready to Start Reading?
                            </h2>
                            <p className="mb-8 text-sm text-zinc-400 sm:text-base">
                                Explore my collection of authentic, pre-loved
                                books. Find your next favorite story today!
                            </p>
                            <Link
                                href="/books"
                                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-base font-medium text-black transition-colors hover:bg-zinc-200"
                            >
                                Explore Collection
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Abstract Shapes */}
                        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-zinc-800 opacity-50 blur-3xl dark:bg-zinc-700" />
                        <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-zinc-800 opacity-50 blur-3xl dark:bg-zinc-700" />
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
