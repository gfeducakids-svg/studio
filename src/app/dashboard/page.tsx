
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
    <div className="flex flex-col gap-4">
        <div className="aspect-[4/3] w-full rounded-lg bg-muted"></div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-10 w-full rounded-lg" />
    </div>
);


export default function DashboardPage() {
  const { userData, loading } = useUserData();

  return (
    <div className="animate-in flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Sua Jornada de Aprendizado</h1>
        <p className="text-muted-foreground">Continue de onde parou e explore novas aventuras!</p>
      </div>

      <ProgressTrail />

      <div>
        <h2 className="text-2xl font-bold font-headline mb-2">Cursos e Atividades</h2>
        <p className="text-muted-foreground mb-8">Continue sua jornada para dominar a leitura e a escrita.</p>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
              Array.from({ length: 4 }).map((_, index) => <ModuleSkeleton key={index} />)
          ) : (
              modules.map((module, index) => (
                <div key={module.id} className="animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <ModuleCard 
                    {...module}
                    isUnlocked={!!userData?.progress?.[module.id] && userData.progress[module.id].status !== 'locked'}
                  />
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
