
import { UserNav } from "@/components/user-nav";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2 font-semibold">
        <SidebarTrigger className="hidden md:flex" />
        <BookOpen className="h-8 w-8 text-primary md:hidden" />
         <span className="text-xl font-headline md:hidden">
            Grafismo Fonético
          </span>
      </div>
      <div className="flex-1" />
      <UserNav />
    </header>
  );
}
