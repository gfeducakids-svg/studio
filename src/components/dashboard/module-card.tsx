import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  isUnlocked: boolean;
}

export default function ModuleCard({ id, title, description, icon: Icon, isUnlocked }: ModuleCardProps) {
  const linkHref = isUnlocked ? `/dashboard/modules/${id}` : undefined;

  return (
      <Card className={cn(
        "flex flex-col h-full transition-all duration-300 ease-out group",
        isUnlocked 
          ? 'hover:shadow-2xl hover:scale-105 hover:-translate-y-1 hover:border-primary' 
          : 'cursor-default'
      )}>
        <CardHeader className="p-0 relative aspect-[4/3] w-full">
         <Link href={linkHref ?? '#'} legacyBehavior passHref>
          <a className={cn(!linkHref && "pointer-events-none")}>
           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-300/20 rounded-t-lg flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110">
             <Icon className="h-16 w-16 text-primary/50 transition-all duration-500 group-hover:text-primary/80 group-hover:scale-125" />
             {!isUnlocked && (
                <>
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300"></div>
                  <Lock className="h-12 w-12 text-muted-foreground z-10 transition-transform duration-300 group-hover:scale-110"/>
                </>
             )}
           </div>
          </a>
          </Link>
        </CardHeader>
        <div className="flex flex-col flex-grow p-4">
          <CardTitle className="font-headline text-lg leading-tight">{title}</CardTitle>
          <CardDescription className="mt-2 text-xs flex-grow">{description}</CardDescription>
        </div>
        <CardFooter className="p-4 pt-0">
          <Button 
            asChild={isUnlocked}
            variant={isUnlocked ? 'default' : 'secondary'} 
            className={cn(
              "w-full transition-all duration-200", 
              !isUnlocked && "bg-accent text-accent-foreground hover:bg-accent/90 cursor-not-allowed"
            )}
            disabled={!isUnlocked}
          >
            {isUnlocked ? <Link href={`/dashboard/modules/${id}`}>Acessar Conteúdo</Link> : <span>Comprar</span>}
          </Button>
        </CardFooter>
      </Card>
  );
}
