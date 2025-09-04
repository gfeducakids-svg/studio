
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
        <CardHeader className="p-0 relative w-full overflow-hidden aspect-[16/9] sm:aspect-[4/3]">
         <Link href={linkHref} className={cn(!isUnlocked && "pointer-events-none", "relative block w-full h-full")}>
             <Image
                src={imageUrl}
                alt={title}
                fill
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
             />
             {!isUnlocked && (
                <div className="absolute inset-0 bg-background/70 backdrop-blur-sm transition-all duration-300 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-white z-10"/>
                </div>
             )}
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow p-3 sm:p-4">
          <CardTitle className="font-headline text-base sm:text-lg leading-tight flex-grow">
            {title}
          </CardTitle>
        </CardContent>
        <CardFooter className="p-3 sm:p-4 pt-0">
          <Button 
            asChild={isUnlocked}
            variant={isUnlocked ? 'default' : 'secondary'} 
            className={cn(
              "w-full transition-all duration-200 rounded-lg", 
              !isUnlocked && "bg-yellow-100 text-yellow-900 hover:bg-yellow-200 cursor-not-allowed"
            )}
            disabled={!isUnlocked}
          >
            {isUnlocked ? <Link href={`/dashboard/modules/${id}`}>Acessar Conteúdo</Link> : <span>Liberar Acesso</span>}
          </Button>
        </CardFooter>
      </Card>
  );
}
