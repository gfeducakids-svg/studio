
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
      className={cn(
        'group flex h-full flex-col overflow-hidden transition-all duration-300 ease-out',
        isUnlocked ? 'hover:-translate-y-1 hover:shadow-xl' : 'cursor-default'
      )}
    >
      <CardHeader className="relative w-full overflow-hidden p-0 aspect-video md:aspect-[4/3]">
        <Link
          href={linkHref}
          className={cn(!isUnlocked && 'pointer-events-none', 'relative block w-full h-full')}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm transition-all duration-300">
              <Lock className="z-10 h-8 w-8 text-white" />
            </div>
          )}
        </Link>
      </CardHeader>

      <CardContent className="flex grow flex-col p-3 sm:p-4">
        <CardTitle className="flex-grow font-headline text-base leading-tight sm:text-lg">
          {title}
        </CardTitle>
      </CardContent>

      <CardFooter className="p-3 pt-0 sm:p-4">
        <Button
          asChild={isUnlocked}
          variant={isUnlocked ? 'default' : 'secondary'}
          className={cn(
            'h-11 w-full rounded-lg transition-all duration-200',
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
