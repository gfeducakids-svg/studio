
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
    // Wrapper principal do Card.
    // - `group`: Permite estilizar filhos com base no estado de hover/focus do pai.
    // - `flex flex-col`: Organiza o conteúdo do card (header, content, footer) em uma coluna vertical.
    // - `h-full`: Garante que o card ocupe toda a altura disponível em sua célula do grid.
    // - `min-w-0`: Permite que o card encolha, evitando que o conteúdo interno o alargue.
    // - `overflow-hidden`: Necessário para que o `rounded-lg` funcione com a imagem interna.
    <Card
      className="group flex h-full min-w-0 flex-col overflow-hidden transition-all duration-300 ease-out"
    >
      {/* 
        Header do Card (Área da Imagem).
        - `relative`: Necessário para o posicionamento absoluto da imagem com `fill`.
        - `p-0`: Remove o padding padrão do CardHeader.
        - `aspect-[16/9] sm:aspect-[3/2] md:aspect-[4/3]`: Define a proporção da imagem de forma responsiva.
          - Mobile: 16:9 (mais largo, ocupa menos altura).
          - Tablet: 3:2.
          - Desktop: 4:3 (mais quadrado, ideal para grades).
      */}
      <CardHeader className="relative w-full overflow-hidden p-0 aspect-[16/9] sm:aspect-[3/2] md:aspect-[4/3]">
        <Link
          href={linkHref}
          className={cn(!isUnlocked && 'pointer-events-none', 'relative block h-full w-full')}
        >
          {/* 
            Componente de Imagem do Next.js.
            - `fill`: Faz a imagem preencher todo o contêiner pai (`CardHeader`).
            - `object-cover`: Garante que a imagem cubra todo o espaço sem distorcer, cortando o excesso.
            - `transition-transform`: Anima a imagem no hover do `group`.
          */}
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Overlay para o estado de bloqueado. */}
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm transition-all duration-300">
              <Lock className="z-10 h-8 w-8 text-white" />
            </div>
          )}
        </Link>
      </CardHeader>

      {/* 
        Conteúdo do Card (Título e Descrição).
        - `flex grow flex-col`: Ocupa o espaço vertical restante (`grow`) e organiza o conteúdo internamente.
        - `min-w-0`: Permite que o conteúdo encolha sem quebrar o layout.
        - `p-3 sm:p-4`: Padding responsivo.
      */}
      <CardContent className="flex grow min-w-0 flex-col p-3 sm:p-4">
        {/* 
          Título do Card.
          - `flex-grow`: Ocupa o espaço disponível, empurrando o `CardFooter` para baixo.
          - `min-w-0`: Necessário para que o `line-clamp` funcione corretamente em um container flex.
          - `line-clamp-2`: Limita o título a duas linhas, adicionando "..." se for maior. Evita que títulos longos aumentem a altura do card.
          - `text-sm sm:text-base md:text-lg`: Tamanho da fonte responsivo.
        */}
        <CardTitle className="flex-grow min-w-0 font-headline text-sm sm:text-base md:text-lg leading-tight line-clamp-2">
          {title}
        </CardTitle>
        {/* A descrição pode ser adicionada aqui se necessário. Ex: <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{description}</p> */}
      </CardContent>

      {/* 
        Rodapé do Card (Botão).
        - `p-3 pt-0 sm:p-4`: Padding responsivo que alinha com o `CardContent`.
      */}
      <CardFooter className="p-3 pt-0 sm:p-4">
        <Button
          asChild={isUnlocked}
          variant={isUnlocked ? 'default' : 'secondary'}
          // `w-full` faz o botão ocupar toda a largura. `h-11` dá uma altura fixa e robusta.
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
