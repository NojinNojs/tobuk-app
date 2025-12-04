import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import {
    Book,
    BookOpen,
    Home,
    LogOut,
    Menu,
    Settings,
    ShoppingBag,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { auth } = usePage<{
        auth: { user: { name: string; email: string; role: string } | null };
    }>().props;
    const { url } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/books', label: 'Books', icon: Book },
    ];

    if (auth.user) {
        navLinks.push({
            href: '/orders',
            label: 'My Orders',
            icon: ShoppingBag,
        });
    }

    const isUrlActive = (path: string) => {
        if (path === '/' && url === '/') return true;
        if (path !== '/' && url.startsWith(path)) return true;
        return false;
    };

    const menuVariants: Variants = {
        hidden: {
            clipPath: 'circle(0% at 100% 0)',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.05,
                staggerDirection: -1,
                when: 'afterChildren',
            },
        },
        visible: {
            clipPath: 'circle(150% at 100% 0)',
            transition: {
                type: 'spring',
                stiffness: 20,
                damping: 10,
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 transition-opacity hover:opacity-80"
                        >
                            <BookOpen className="h-6 w-6" />
                            <span className="text-xl font-bold tracking-tight">
                                ToBuk
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center gap-8 md:flex">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
                                        isUrlActive(link.href)
                                            ? 'text-foreground'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Auth Actions */}
                        <div className="hidden items-center gap-4 md:flex">
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="gap-2 font-medium"
                                        >
                                            <User className="h-4 w-4" />
                                            {auth.user.name}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-56"
                                    >
                                        <DropdownMenuLabel>
                                            My Account
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {auth.user.role === 'admin' && (
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href="/admin"
                                                    className="flex cursor-pointer items-center"
                                                >
                                                    <User className="mr-2 h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/settings"
                                                className="flex cursor-pointer items-center"
                                            >
                                                <Settings className="mr-2 h-4 w-4" />
                                                Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="flex w-full cursor-pointer items-center text-red-600"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex gap-2">
                                    <Button variant="ghost" asChild>
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className="bg-foreground text-background hover:bg-foreground/90"
                                    >
                                        <Link href="/register">Register</Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Fullscreen Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed inset-0 z-[100] flex flex-col bg-background"
                    >
                        {/* Close Button */}
                        <div className="container mx-auto flex h-16 items-center justify-end px-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full hover:bg-muted"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Menu Content */}
                        <div className="flex flex-1 flex-col items-center justify-center gap-8 pb-16">
                            <div className="flex flex-col items-center gap-8">
                                {navLinks.map((link, index) => {
                                    const isActive = isUrlActive(link.href);
                                    return (
                                        <motion.div
                                            key={link.href}
                                            variants={itemVariants}
                                        >
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    'group flex flex-col items-center gap-1 transition-colors',
                                                    isActive
                                                        ? 'text-primary'
                                                        : 'text-muted-foreground hover:text-foreground',
                                                )}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                <span className="text-xs font-medium opacity-60">
                                                    0{index + 1}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'text-4xl font-bold tracking-tight',
                                                        isActive &&
                                                            'underline decoration-2 underline-offset-8',
                                                    )}
                                                >
                                                    {link.label}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <motion.div
                                variants={itemVariants}
                                className="mt-12 flex flex-col items-center gap-6"
                            >
                                {auth.user ? (
                                    <>
                                        <div className="flex items-center gap-2 text-lg font-medium">
                                            <User className="h-5 w-5" />
                                            {auth.user.name}
                                        </div>
                                        <div className="flex gap-6">
                                            {auth.user.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-input bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
                                                    onClick={() =>
                                                        setMobileMenuOpen(false)
                                                    }
                                                >
                                                    <User className="h-5 w-5" />
                                                </Link>
                                            )}
                                            <Link
                                                href="/settings"
                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-input bg-background transition-colors hover:bg-accent hover:text-accent-foreground"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                <Settings className="h-5 w-5" />
                                            </Link>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-background text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                <LogOut className="h-5 w-5" />
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            asChild
                                            className="w-48"
                                        >
                                            <Link href="/login">Login</Link>
                                        </Button>
                                        <Button
                                            size="lg"
                                            asChild
                                            className="w-48 bg-foreground text-background hover:bg-foreground/90"
                                        >
                                            <Link href="/register">
                                                Register
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
