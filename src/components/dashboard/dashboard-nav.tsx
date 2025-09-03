"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Award, MessageSquare, BookText } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export function DashboardNav() {
    const pathname = usePathname();
    const navItems = [
        { href: '/dashboard', label: 'Home', icon: Home, exact: true },
        { href: '/dashboard/achievements', label: 'Achievements', icon: Award },
        { href: '/dashboard/feedback', label: 'Feedback', icon: MessageSquare },
        { href: '/dashboard/materials', label: 'Materials', icon: BookText },
    ];

    return (
        <SidebarMenu>
            {navItems.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                            <Link href={item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
