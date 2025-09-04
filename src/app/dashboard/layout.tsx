
import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Header from '@/components/header';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import BottomNav from '@/components/dashboard/bottom-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Sidebar para Desktop */}
      <Sidebar className="hidden md:block" collapsible="icon">
        <SidebarHeader className="p-2">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold h-10 px-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-headline group-data-[collapsible=icon]:hidden">
              EducaKIDS
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <DashboardNav />
        </SidebarContent>
      </Sidebar>
      
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-8 pb-24 md:pb-8">
          {children}
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
