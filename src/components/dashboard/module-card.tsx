
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
    <Card
      className="w-full max-w-full min-w-0 h-auto overflow-hidden rounded-lg flex flex-col transition-all duration-300 ease-out group"
    >
      <CardHeader className="relative w-full p-0 overflow-hidden aspect-video max-h-[180px] sm:max-h-[220px] md:aspect-[4/3] md:max-h-none">
        <Link
          href={linkHref}
          className={cn(!isUnlocked && 'pointer-events-none', 'relative block h-full w-full')}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm transition-all duration-300">
              <Lock className="z-10 h-8 w-8 text-white" />
            </div>
          )}
        </Link>
      </CardHeader>

      <CardContent className="flex grow min-w-0 flex-col p-3 sm:p-4">
        <CardTitle className="flex-grow min-w-0 font-headline text-sm sm:text-base leading-tight line-clamp-2">
          {title}
        </CardTitle>
      </CardContent>

      <CardFooter className="p-3 pt-0 sm:p-4">
        <Button
          asChild={isUnlocked}
          variant={isUnlocked ? 'default' : 'secondary'}
          className={cn(
            'w-full h-10 sm:h-11 rounded-lg transition-all duration-200',
            !isUnlocked && 'cursor-not-allowed bg-yellow-100 text-yellow-900 hover:bg-yellow-200'
          )}
          disabled={!isUnlocked}
        >
          {isUnlocked ? (
            <Link href={`/dashboard/modules/${id}`}>Acessar Conteúdo</Link>
          ) : (
            <span>Liberar Acesso</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
