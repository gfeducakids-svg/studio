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

const ModuleSkeleton = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
    {/* Mobile mais “raso”; desktop sobe para 4:3 */}
    <Skeleton className="w-full aspect-video md:aspect-[4/3]" />
    <div className="flex grow flex-col space-y-3 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="grow" />
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  </div>
);

export default function DashboardPage() {
  const { userData, loading } = useUserData();

  return (
    <div className="animate-in flex flex-col gap-8">
      {/* Wrapper rolável para a trilha no mobile */}
      <div className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 no-scrollbar md:mx-0 md:w-auto md:overflow-visible">
        <ProgressTrail />
      </div>

      <div>
        <h2 className="mb-6 text-center text-2xl font-headline font-bold md:text-left">
          Cursos e Atividades
        </h2>

        {/* Grid:
            - 1 col no mobile
            - 2 col em sm
            - 4 col em lg+
            - items-stretch + h-full nos cards = alturas alinhadas
        */}
        <div
          className="
            grid grid-cols-1 items-stretch gap-6
            sm:grid-cols-2 lg:grid-cols-4
          "
        >
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-full">
                  <ModuleSkeleton />
                </div>
              ))
            : modules.map((module, index) => (
                <div
                  key={module.id}
                  className="h-full animate-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-full">
                    <ModuleCard
                      {...module}
                      isUnlocked={
                        !!userData?.progress?.[module.id] &&
                        userData.progress[module.id].status !== 'locked'
                      }
                    />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
