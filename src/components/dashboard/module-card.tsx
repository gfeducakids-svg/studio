
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import Image from 'next/image';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isUnlocked: boolean;
}

export default function ModuleCard({ id, title, description, imageUrl, isUnlocked }: ModuleCardProps) {
  const linkHref = isUnlocked ? `/dashboard/modules/${id}` : '#';

  return (
      <Card className={cn(
        "flex flex-col h-full transition-all duration-300 ease-out group overflow-hidden",
        isUnlocked 
          ? 'hover:shadow-xl hover:-translate-y-1' 
          : 'cursor-default'
      )}>
        <CardHeader className="p-0 relative w-full max-w-full overflow-hidden h-[clamp(140px,24vw,256px)] lg:h-auto aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3]">
         <Link href={linkHref} className={cn(!isUnlocked && "pointer-events-none", "relative block w-full h-full")}>
             <Image
                src={imageUrl}
                alt={title}
                fill
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
             />
             {!isUnlocked && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300 flex items-center justify-center">
                  <Lock className="h-12 w-12 text-muted-foreground z-10 transition-transform duration-300"/>
                </div>
             )}
          </Link>
        </CardHeader>
        <div className="flex flex-col flex-grow p-4">
          <CardTitle className="font-headline text-[clamp(1rem,1.6vw,1.25rem)] leading-tight">
            {title}
          </CardTitle>
          <CardDescription className="mt-2 text-[clamp(0.85rem,1.3vw,1rem)] flex-grow leading-relaxed line-clamp-2 md:line-clamp-3">
            {description}
          </CardDescription>
        </div>
        <CardFooter className="p-4 pt-0">
          <Button 
            asChild={isUnlocked}
            variant={isUnlocked ? 'default' : 'secondary'} 
            className={cn(
              "w-full transition-all duration-200 h-[clamp(36px,5.5vw,44px)] text-[clamp(0.9rem,1.25vw,1rem)] rounded-lg", 
              !isUnlocked && "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            disabled={!isUnlocked}
          >
            {isUnlocked ? <Link href={`/dashboard/modules/${id}`}>Acessar Conteúdo</Link> : <span>Liberar acesso</span>}
          </Button>
        </CardFooter>
      </Card>
  );
}
