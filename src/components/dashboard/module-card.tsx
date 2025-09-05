
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

const purchaseLinks: { [key: string]: string } = {
  'grafismo-fonetico': 'https://pay.kiwify.com.br/KCqJlXF',
  'desafio-21-dias': 'https://pay.kiwify.com.br/NMxoBd9',
  'historias-curtas': 'https://pay.kiwify.com.br/XK1KQ6v',
  'checklist-alfabetizacao': 'https://pay.kiwify.com.br/OoaIoIT',
};


export default function ModuleCard({ id, title, description, imageUrl, isUnlocked }: ModuleCardProps) {
  const purchaseLink = purchaseLinks[id];
  const linkHref = isUnlocked ? `/dashboard/modules/${id}` : (purchaseLink || '#');

  return (
    <Card className="group flex h-full min-w-0 flex-col overflow-hidden transition-all duration-300 ease-out">
      {/* MÍDIA: aspect-video no mobile, 4:3 em md+ */}
      <CardHeader className="
        relative w-full overflow-hidden p-0
        aspect-video md:aspect-[4/3]
      ">
        <Link
          href={isUnlocked ? `/dashboard/modules/${id}` : '#'}
          className={cn(!isUnlocked && 'pointer-events-none', 'relative block h-full w-full')}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            priority={false}
          />
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm transition-all duration-300">
              <Lock className="z-10 h-8 w-8 text-white" />
            </div>
          )}
        </Link>
      </CardHeader>

      <CardContent className="flex grow min-w-0 flex-col p-3 sm:p-4">
        <CardTitle className="min-w-0 flex-grow font-headline text-[15px] leading-tight line-clamp-2 sm:text-base md:text-lg">
          {title}
        </CardTitle>
        {/* <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p> */}
      </CardContent>

      <CardFooter className="p-3 pt-0 sm:p-4">
        {isUnlocked ? (
          <Button
            asChild
            variant='default'
            className="h-11 w-full rounded-lg transition-all duration-200"
          >
            <Link href={`/dashboard/modules/${id}`}>Acessar Conteúdo</Link>
          </Button>
        ) : (
          purchaseLink ? (
             <Button
                asChild
                className={cn(
                    'h-11 w-full rounded-lg transition-all duration-200',
                    'bg-yellow-400 text-yellow-950 font-bold hover:bg-yellow-500'
                )}
            >
                <a href={purchaseLink} target="_blank" rel="noopener noreferrer">Liberar Acesso</a>
            </Button>
          ) : (
             <Button
                disabled
                variant='secondary'
                className="h-11 w-full rounded-lg cursor-not-allowed"
            >
                <span>Liberar Acesso</span>
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}
