
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
        <CardHeader className="p-0 relative w-full overflow-hidden aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] max-h-40 sm:max-h-48 md:max-h-56 lg:max-h-none">
         <Link href={linkHref} className={cn(!isUnlocked && "pointer-events-none", "relative block w-full h-full")}>
             <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover w-full h-full transition-transform duration-500"
             />
             {!isUnlocked && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-all duration-300 flex items-center justify-center">
                  <Lock className="h-12 w-12 text-muted-foreground z-10 transition-transform duration-300"/>
                </div>
             )}
          </Link>
        </CardHeader>
        <div className="flex flex-col flex-grow p-4">
          <CardTitle className="font-headline text-base sm:text-[17px] md:text-lg lg:text-xl leading-tight">
            {title}
          </CardTitle>
          <CardDescription className="mt-2 text-xs sm:text-sm md:text-[15px] lg:text-base flex-grow leading-relaxed line-clamp-2 md:line-clamp-3">
            {description}
          </CardDescription>
        </div>
        <CardFooter className="p-4 pt-0">
          <Button 
            asChild={isUnlocked}
            variant={isUnlocked ? 'default' : 'secondary'} 
            className={cn(
              "w-full transition-all duration-200 h-9 sm:h-10 md:h-11 text-sm sm:text-[15px] md:text-base rounded-lg", 
              !isUnlocked && "bg-yellow-500 text-black hover:bg-yellow-600 cursor-not-allowed"
            )}
            disabled={!isUnlocked}
          >
            {isUnlocked ? <Link href={`/dashboard/modules/${id}`}>Acessar Conteúdo</Link> : <span>Liberar acesso</span>}
          </Button>
        </CardFooter>
      </Card>
  );
}
