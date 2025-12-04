import { Icon } from '@/components/icon';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    const page = usePage();
    return (
        <SidebarGroup
            {...props}
            className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}
        >
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const url = resolveUrl(item.href);
                        const isExternal = url.startsWith('http');
                        const isActive =
                            !isExternal && page.url.startsWith(url);

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    className="transition-all duration-200 ease-in-out hover:translate-x-1 hover:bg-sidebar-accent/50 active:scale-95 data-[active=true]:border-l-2 data-[active=true]:border-primary data-[active=true]:bg-sidebar-accent data-[active=true]:font-bold data-[active=true]:shadow-sm [&>svg]:transition-colors [&>svg]:duration-200 hover:[&>svg]:text-primary data-[active=true]:[&>svg]:text-primary"
                                >
                                    {isExternal ? (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.icon && (
                                                <Icon
                                                    iconNode={item.icon}
                                                    className="h-5 w-5"
                                                />
                                            )}
                                            <span>{item.title}</span>
                                        </a>
                                    ) : (
                                        <Link href={url}>
                                            {item.icon && (
                                                <Icon
                                                    iconNode={item.icon}
                                                    className="h-5 w-5"
                                                />
                                            )}
                                            <span>{item.title}</span>
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
