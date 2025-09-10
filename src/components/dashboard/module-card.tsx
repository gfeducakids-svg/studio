
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Lock, ShoppingCart } from 'lucide-react';
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

const lockedHeadlines: { [key: string]: string } = {
  'historias-curtas': 'Histórias viciantes de 5 minutos que fazem seu filho IMPLORAR para ler mais. Seu filho aprende até na hora de Dormir!',
  'checklist-alfabetizacao': 'O roteiro exato para alfabetizar em casa - Checklist Ideal para Monitorar o Progresso do seu pequeno!',
  'desafio-21-dias': 'Fim da vergonha na leitura em voz alta! Seu filho gagueja ou troca letras ao ler? Este método elimina TODOS os erros de fala em 21 dias.',
};

const modulePrices: { [key: string]: string } = {
  'desafio-21-dias': 'R$ 17,90',
  'historias-curtas': 'R$ 9,90',
  'checklist-alfabetizacao': 'R$ 9,90',
};


export default function ModuleCard({ id, title, description, imageUrl, isUnlocked }: ModuleCardProps) {
  const purchaseLink = purchaseLinks[id];
  const microHeadline = lockedHeadlines[id];
  const price = modulePrices[id];

  return (
    <Card className="group flex h-full min-w-0 flex-col overflow-hidden transition-all duration-300 ease-out">
      <CardHeader className="relative w-full overflow-hidden p-0 aspect-video">
        <Link
          href={isUnlocked ? `/dashboard/modules/${id}` : '#'}
          className={cn(!isUnlocked && 'pointer-events-none', 'relative block h-full w-full')}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
          />
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm transition-all duration-300">
              <Lock className="z-10 h-8 w-8 text-white" />
            </div>
          )}
        </Link>
         {!isUnlocked && price && (
          <div className="absolute top-2 right-2 z-10 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground shadow-lg">
            {price}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex grow min-w-0 flex-col p-4">
        <div className="flex-grow">
            <CardTitle className="min-w-0 font-headline text-base leading-tight md:text-lg">
                {title}
            </CardTitle>
            {!isUnlocked && microHeadline && (
            <p className="mt-2 text-xs text-center font-semibold leading-snug sm:text-left text-muted-foreground">{microHeadline}</p>
            )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
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
                <a href={purchaseLink} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Liberar Acesso
                </a>
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
