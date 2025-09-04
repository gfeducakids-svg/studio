
'use client';
import React from 'react';
import ModuleCard from '@/components/dashboard/module-card';
import { useUserData } from '@/hooks/use-user-data';
import { Skeleton } from '@/components/ui/skeleton';
import ProgressTrail from '@/components/dashboard/progress-trail';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
  <div className="flex flex-col w-full gap-2 sm:gap-2.5 md:gap-3 lg:gap-3">
    {/* Thumb: altura controlada em mobile/tablet, normal no desktop */}
    <div className="
      w-full rounded-md bg-muted aspect-[16/10]
      max-h-40 sm:max-h-48 md:max-h-56
      lg:max-h-none lg:aspect-[4/3]
    " />

    {/* Linha 1: compacta no mobile/tablet, normal no desktop */}
    <Skeleton
      className="
        h-[10px] w-1/2
        sm:h-3 sm:w-2/3
        md:h-[14px] md:w-3/4
        lg:h-4 lg:w-3/4
      "
    />

    {/* Linha 2: idem; mantém largura cheia só no desktop */}
    <Skeleton
      className="
        h-[10px] w-2/3 rounded-md
        sm:h-3 sm:w-3/4
        md:h-[14px] md:w-11/12
        lg:h-4 lg:w-full
      "
    />
  </div>
);


export default function DashboardPage() {
  const { userData, loading } = useUserData();

  return (
    <div className="animate-in flex flex-col gap-6">
      <ProgressTrail />

      <div className="mt-8">
        <h2 className="text-2xl font-bold font-headline mb-4">Cursos e Atividades</h2>
        
        <Carousel 
            opts={{
                align: "start",
                slidesToScroll: "auto",
                dragFree: true
            }}
            className="w-full"
        >
            <CarouselContent>
              {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-11/12 sm:basis-1/2 lg:basis-1/4">
                       <div className="p-1">
                        <ModuleSkeleton />
                       </div>
                    </CarouselItem>
                  ))
              ) : (
                  modules.map((module, index) => (
                    <CarouselItem key={module.id} className="basis-11/12 sm:basis-1/2 lg:basis-1/4 animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="p-1 h-full">
                        <ModuleCard 
                          {...module}
                          isUnlocked={!!userData?.progress?.[module.id] && userData.progress[module.id].status !== 'locked'}
                        />
                      </div>
                    </CarouselItem>
                  ))
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </div>
  );
}
