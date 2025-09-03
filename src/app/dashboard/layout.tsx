
import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Header from '@/components/header';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarSeparator } from '@/components/ui/sidebar';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="p-2">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-headline group-data-[collapsible=icon]:hidden">
                EducaKIDS
              </span>
            </Link>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
