import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    // Helper function to check if a route is active
    const isRouteActive = (item: NavItem) => {
        const currentUrl = page.url;
        const itemUrl = resolveUrl(item.href);

        // Exact match
        if (currentUrl === itemUrl) return true;

        // If exact match is required, stop here
        if (item.exact) return false;

        // Check if current URL starts with item URL followed by a slash
        // This ensures /admin doesn't match /admin/books
        if (currentUrl.startsWith(itemUrl + '/')) return true;

        return false;
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="mb-1 px-3 text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild={!item.disabled}
                            disabled={item.disabled}
                            isActive={!item.disabled && isRouteActive(item)}
                            tooltip={{
                                children: item.disabled
                                    ? `${item.title} - ${item.badge || 'Coming Soon'}`
                                    : item.title,
                            }}
                            className={`transition-all duration-200 ease-in-out ${
                                item.disabled
                                    ? 'cursor-not-allowed opacity-50 hover:bg-transparent'
                                    : 'hover:translate-x-1 hover:bg-sidebar-accent/50 active:scale-95 data-[active=true]:border-l-2 data-[active=true]:border-primary data-[active=true]:bg-sidebar-accent data-[active=true]:font-bold data-[active=true]:shadow-sm [&>svg]:transition-colors [&>svg]:duration-200 hover:[&>svg]:text-primary data-[active=true]:[&>svg]:text-primary'
                            }`}
                        >
                            {item.disabled ? (
                                <div className="flex w-full items-center gap-2">
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    {item.badge && (
                                        <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
