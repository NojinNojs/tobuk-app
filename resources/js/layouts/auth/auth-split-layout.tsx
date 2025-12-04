import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
    quote?: {
        message: string;
        author: string;
    };
}

export default function AuthSplitLayout({
    children,
    title,
    description,
    quote,
}: PropsWithChildren<AuthLayoutProps>) {
    const { quote: defaultQuote } = usePage<SharedData>().props;
    const displayQuote = quote || defaultQuote;

    return (
        <div className="relative grid min-h-screen flex-col items-center justify-center lg:grid-cols-2">
            {/* Left Panel - Background Image */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(/background-auth.jpg)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
                </div>

                <Link
                    href={home()}
                    className="relative z-20 mb-8 flex items-center text-lg font-medium"
                >
                    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                    <span className="text-2xl font-bold">ToBuk</span>
                </Link>

                <div className="relative z-20 mt-auto space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm font-medium tracking-wider text-white/80 uppercase">
                            Reading is Dreaming with Open Eyes
                        </p>
                        <h2 className="font-serif text-4xl leading-tight font-bold">
                            Unlock a World of Stories
                        </h2>
                        {displayQuote && (
                            <p className="max-w-md text-lg leading-relaxed text-white/90">
                                {displayQuote.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full p-6 sm:p-8 lg:p-12">
                <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-8">
                    {/* Mobile Logo */}
                    <Link
                        href={home()}
                        className="mb-4 flex items-center justify-center lg:hidden"
                    >
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12 dark:text-white" />
                        <span className="ml-2 text-2xl font-bold">ToBuk</span>
                    </Link>

                    {/* Header */}
                    <div className="flex flex-col space-y-2 text-left">
                        <h1 className="font-serif text-3xl font-semibold">
                            {title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
