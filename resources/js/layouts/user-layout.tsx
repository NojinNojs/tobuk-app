import Navbar from '@/components/navbar/navbar';
import { Toaster } from '@/components/ui/sonner';
import { type ReactNode } from 'react';

interface UserLayoutProps {
    children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="relative min-h-screen bg-background font-sans text-foreground antialiased">
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors position="top-right" />
        </div>
    );
}
