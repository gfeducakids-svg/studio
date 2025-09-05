
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
  <div className="flex h-auto min-w-0 flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="relative w-full overflow-hidden p-0 aspect-video md:aspect-[4/3] max-h-[240px] md:max-h-none">
      <Skeleton className="absolute inset-0 h-full w-full" />
    </div>
    <div className="flex grow flex-col p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-5/6" />
      <div className="grow" />
    </div>
    <div className="p-4 pt-0">
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  </div>
);

export default function DashboardPage() {
  const { userData, loading } = useUserData();

  return (
    <div className="animate-in flex w-full flex-col gap-8 overflow-x-hidden">
      <div className="overflow-x-hidden">
        <ProgressTrail />
      </div>

      <div className="w-full">
        <h2 className="mb-6 text-center text-2xl font-headline font-bold md:text-left">
          Cursos e Atividades
        </h2>
        
        <div className="mx-auto max-w-md sm:max-w-none">
          <div
            className="
              grid w-full items-stretch gap-4 sm:gap-5 lg:gap-6
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
              [grid-auto-rows:1fr]
            "
          >
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-full min-w-0 w-full max-w-[420px] sm:max-w-none mx-auto sm:mx-0"
                  >
                    <ModuleSkeleton />
                  </div>
                ))
              : modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="
                      h-full min-w-0 w-full max-w-[420px] sm:max-w-none mx-auto sm:mx-0
                      animate-in
                    "
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
    </div>
  );
}
