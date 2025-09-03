'use client';
import React from 'react';
import ModuleCard from '@/components/dashboard/module-card';
import { useUserData } from '@/hooks/use-user-data';
import { BookCheck, Gem, Rocket, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const modules = [
  {
    id: 'grafismo-fonetico',
    title: 'Método Chinês de Grafismo Fonético',
    description: 'A base da alfabetização com um método inovador.',
    icon: Rocket,
  },
  {
    id: 'desafio-21-dias',
    title: 'Desafio 21 Dias de Pronúncia',
    description: 'Aperfeiçoe a pronúncia e a fluidez em 3 semanas.',
    icon: BookCheck,
  },
  {
    id: 'checklist-alfabetizacao',
    title: 'CheckList de Alfabetização',
    description: 'Acompanhe o progresso e identifique pontos de melhoria.',
    icon: Gem,
  },
  {
    id: 'historias-curtas',
    title: 'Histórias Curtas',
    description: 'Pratique a leitura com histórias divertidas e envolventes.',
    icon: Star,
  },
];

const ModuleSkeleton = () => (
    <div className="flex flex-col gap-4">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-10 w-full rounded-lg" />
    </div>
);


export default function DashboardPage() {
  const { userData, loading } = useUserData();

  return (
    <div className="animate-in">
      <h1 className="text-3xl font-bold font-headline mb-2">Cursos e Atividades</h1>
      <p className="text-muted-foreground mb-8">Continue sua jornada para dominar a leitura e a escrita.</p>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
            Array.from({ length: 4 }).map((_, index) => <ModuleSkeleton key={index} />)
        ) : (
            modules.map((module, index) => (
              <div key={module.id} className="animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ModuleCard 
                  {...module}
                  isUnlocked={userData?.modules?.includes(module.id) ?? false}
                />
              </div>
            ))
        )}
      </div>
    </div>
  );
}
