
'use client';

import React from 'react';
import ModuleCard from '@/components/dashboard/module-card';
import { useUserData } from '@/hooks/use-user-data';
import { Skeleton } from '@/components/ui/skeleton';
import ProgressTrail from '@/components/dashboard/progress-trail';

const modules = [
  { id: 'grafismo-fonetico', title: 'Método Chinês de Grafismo Fonético', description: 'A base da alfabetização com um método inovador.', imageUrl: 'https://i.imgur.com/F2cdIv3.png' },
  { id: 'desafio-21-dias', title: 'Desafio 21 Dias de Pronúncia', description: 'Aperfeiçoe a pronúncia e a fluidez em 3 semanas.', imageUrl: 'https://i.imgur.com/8AhIuQO.jpeg' },
  { id: 'checklist-alfabetizacao', title: 'Checklist de Alfabetização', description: 'Acompanhe cada etapa do desenvolvimento da criança.', imageUrl: 'https://i.imgur.com/rm9VL7V.jpeg' },
  { id: 'historias-curtas', title: 'Histórias Curtas', description: 'Pratique a leitura com histórias divertidas e envolventes.', imageUrl: 'https://i.imgur.com/Fzlyoz1.png' },
];

const ModuleSkeleton = () => (
  <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="relative w-full overflow-hidden p-0 aspect-video md:aspect-[4/3] max-h-[clamp(140px,38vh,260px)] md:max-h-[clamp(180px,32vh,340px)]">
      <Skeleton className="absolute inset-0 h-full w-full" />
    </div>
    <div className="flex grow flex-col p-3 sm:p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-5/6" />
      <div className="grow" />
    </div>
    <div className="p-3 pt-0 sm:p-4">
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  </div>
);

export default function DashboardPage() {
  const { userData, loading } = useUserData();

  return (
    <div className="animate-in flex w-full flex-col gap-6 sm:gap-8 overflow-x-hidden">
      <div className="overflow-x-hidden">
        <ProgressTrail />
      </div>

      <div className="w-full">
        <h2 className="mb-4 sm:mb-5 text-left text-2xl font-headline font-bold">
          Cursos e Atividades
        </h2>

        <div
          className="
            grid w-full items-stretch
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
            gap-4
          "
        >
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-full min-w-0 w-full">
                  <ModuleSkeleton />
                </div>
              ))
            : modules.map((module, index) => (
                <div
                  key={module.id}
                  className="h-full min-w-0 w-full animate-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ModuleCard
                    {...module}
                    isUnlocked={
                      !!userData?.progress?.[module.id] &&
                      (userData.progress[module.id].status === 'unlocked' || userData.progress[module.id].status === 'completed')
                    }
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
