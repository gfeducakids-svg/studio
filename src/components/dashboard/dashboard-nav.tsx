"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Award, MessageSquare, BookText, LifeBuoy } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export function DashboardNav() {
    const pathname = usePathname();
    const navItems = [
        { href: '/dashboard', label: 'Cursos', icon: Home, exact: true },
        { href: '/dashboard/materials', label: 'Materiais', icon: BookText },
        { href: 'dashboard/achievements', label: 'Conquistas', icon: Award },
        { href: '/dashboard/feedback', label: 'Comentários', icon: MessageSquare },
        { href: '/dashboard/support', label: 'Suporte', icon: LifeBuoy },
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
