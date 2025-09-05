
import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Header from '@/components/header';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset
} from '@/components/ui/sidebar';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import BottomNav from '@/components/dashboard/bottom-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar className="hidden md:block" collapsible="icon">
        <SidebarHeader className="p-2">
          <Link href="/dashboard" className="flex h-10 items-center gap-2 px-2 font-semibold">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="font-headline text-xl group-data-[collapsible=icon]:hidden">
              EducaKIDS
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <DashboardNav />
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex min-h-[100dvh] flex-col">
        <Header />

        <main
          className="
            mx-auto w-full max-w-screen-xl
            flex-1 overflow-y-auto overflow-x-hidden
            px-4 pt-8 md:px-6 lg:px-8
            pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8
          "
        >
          {children}
        </main>

        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
}
