import Heading from '@/components/heading';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <Heading
                title="Settings"
                description="Manage your profile and account settings"
            />

            <div className="mt-6 space-y-8">
                <div className="w-full">
                    <nav className="mb-8 flex space-x-4 overflow-x-auto border-b pb-4">
                        {sidebarNavItems.map((item, index) => (
                            <Link
                                key={`${resolveUrl(item.href)}-${index}`}
                                href={item.href}
                                className={cn(
                                    'px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:text-primary',
                                    isSameUrl(currentPath, item.href)
                                        ? 'border-b-2 border-primary text-primary'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-1">
                        <section className="max-w-2xl space-y-12">
                            {children}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
