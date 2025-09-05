
'use client';
import React from 'react';
import ModuleCard from '@/components/dashboard/module-card';
import { useUserData } from '@/hooks/use-user-data';
import { Skeleton } from '@/components/ui/skeleton';
import ProgressTrail from '@/components/dashboard/progress-trail';

const modules = [
  {
    id: 'grafismo-fonetico',
    title: 'Método Chinês de Grafismo Fonético',
    description: 'A base da alfabetização com um método inovador.',
    imageUrl: 'https://i.imgur.com/F2cdIv3.png',
  },
  {
    id: 'desafio-21-dias',
    title: 'Desafio 21 Dias de Pronúncia',
    description: 'Aperfeiçoe a pronúncia e a fluidez em 3 semanas.',
    imageUrl: 'https://i.imgur.com/8AhIuQO.jpeg',
  },
  {
    id: 'checklist-alfabetizacao',
    title: 'Checklist de Alfabetização',
    description: 'Acompanhe cada etapa do desenvolvimento da criança.',
    imageUrl: 'https://i.imgur.com/iX6drj2.jpeg',
  },
  {
    id: 'historias-curtas',
    title: 'Histórias Curtas',
    description: 'Pratique a leitura com histórias divertidas e envolventes.',
    imageUrl: 'https://i.imgur.com/Fzlyoz1.png',
  },
];

// O Skeleton (esqueleto de carregamento) agora espelha a estrutura do card real
// para uma transição suave e sem saltos de layout (layout shift).
const ModuleSkeleton = () => (
  <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
    {/* A proporção da imagem do skeleton corresponde à do card real em diferentes breakpoints. */}
    <div className="relative w-full overflow-hidden p-0 aspect-[16/9] sm:aspect-[3/2] md:aspect-[4/3]">
      <Skeleton className="h-full w-full" />
    </div>
    {/* O conteúdo do skeleton também imita o espaçamento e a estrutura do card. */}
    <div className="flex grow flex-col space-y-3 p-3 sm:p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="grow" />
      {/* O rodapé com o botão tem uma altura fixa para manter a consistência. */}
      <div className="p-3 pt-0 sm:p-4 -m-3 sm:-m-4 mt-2">
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { userData, loading } = useUserData();

  return (
    <div className="animate-in flex flex-col gap-8">
      <ProgressTrail />

      <div>
        <h2 className="mb-6 text-center text-2xl font-headline font-bold md:text-left">
          Cursos e Atividades
        </h2>

        {/* 
          Container do Grid:
          - `grid`: Ativa o layout de grade.
          - `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`: Define o número de colunas por breakpoint (1 no mobile, 2 em tablets, 4 em desktops).
          - `items-stretch`: Faz com que os itens do grid se estiquem para preencher a altura da célula, útil quando combinado com `h-full` nos filhos.
          - `gap-4 sm:gap-5 lg:gap-6`: Espaçamento responsivo entre os cards.
          - `[grid-auto-rows:1fr]`: Garante que todas as linhas do grid tenham a mesma altura, o que força todos os cards em uma linha a terem a mesma altura. Essencial para alinhamento.
        */}
        <div
          className="
            grid w-full items-stretch gap-4 sm:gap-5 lg:gap-6 
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
            [grid-auto-rows:1fr]
          "
        >
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                // Wrapper de cada item do grid.
                // - `h-full`: Faz o item ocupar toda a altura da sua linha no grid.
                // - `min-w-0`: Extremamente importante em containers flex ou grid. Permite que o item encolha abaixo de sua largura de conteúdo intrínseca, evitando que ele "empurre" o layout.
                <div key={index} className="h-full min-w-0">
                  <ModuleSkeleton />
                </div>
              ))
            : modules.map((module, index) => (
                <div
                  key={module.id}
                  className="h-full min-w-0 animate-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ModuleCard
                    {...module}
                    isUnlocked={
                      !!userData?.progress?.[module.id] &&
                      userData.progress[module.id].status !== 'locked'
                    }
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
