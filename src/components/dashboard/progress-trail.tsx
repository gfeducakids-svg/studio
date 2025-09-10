
'use client'

import React from 'react';
import { Book, Check, Star, CalendarDays, ClipboardCheck, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUserData } from "@/hooks/use-user-data";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';


const mainTrailDetails = [
  { id: 'intro', title: 'Introdução', progressKey: 'grafismo-fonetico.submodules.intro' },
  { id: 'pre-alf', title: 'Pré-Alfabetização', progressKey: 'grafismo-fonetico.submodules.pre-alf' },
  { id: 'alfabeto', title: 'O Alfabeto', progressKey: 'grafismo-fonetico.submodules.alfabeto' },
  { id: 'silabas', title: 'Sílabas Simples', progressKey: 'grafismo-fonetico.submodules.silabas' },
  { id: 'fonico', title: 'Método Fônico', progressKey: 'grafismo-fonetico.submodules.fonico' },
  { id: 'palavras', title: 'Formação de Palavras', progressKey: 'grafismo-fonetico.submodules.palavras' },
  { id: 'escrita', title: 'Escrita e Leitura', progressKey: 'grafismo-fonetico.submodules.escrita' },
  { id: 'bonus', title: 'Bônus', progressKey: 'grafismo-fonetico.submodules.bonus' },
];

const secondaryModulesDetails = [
  { id: 'desafio-21-dias', title: 'Desafio 21 Dias', icon: CalendarDays, progressKey: 'desafio-21-dias' },
  { id: 'checklist-alfabetizacao', title: 'Checklist', icon: ClipboardCheck, progressKey: 'checklist-alfabetizacao' },
  { id: 'historias-curtas', title: 'Histórias Curtas', icon: Film, progressKey: 'historias-curtas' },
];

const statusConfig = {
  completed: {
    label: 'Concluído',
    node: 'bg-primary border-primary text-primary-foreground',
    line: 'bg-primary',
    icon: Check,
  },
  active: {
    label: 'Ativo',
    node: 'bg-background border-primary border-2 ring-4 ring-primary/20 text-primary animate-pulse',
    line: 'bg-border',
    icon: Book,
  },
  locked: {
    label: 'Bloqueado',
    node: 'bg-muted border-border text-muted-foreground cursor-not-allowed',
    line: 'bg-border',
    icon: Book,
  },
  completedSecondary: {
    label: 'Concluído',
    node: 'bg-yellow-400 border-yellow-500 text-black',
    line: 'bg-yellow-400',
    icon: Star,
  }
};

const getProgressStatus = (
  progress: any,
  progressKey: string
): 'locked' | 'active' | 'completed' => {
  if (!progress || !progressKey) return 'locked';
  const keys = progressKey.split('.');
  let current = progress;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) current = current[key];
    else return 'locked';
  }
  if (current && typeof current === 'object' && 'status' in current) {
    const s = (current as any).status;
    if (s === 'unlocked') return 'active'; // Trata unlocked como active na trilha
    if (s === 'locked' || s === 'active' || s === 'completed') return s;
  }
  return 'locked';
};

const TrailSkeleton = () => {
    const allItems = [...mainTrailDetails, ...secondaryModulesDetails];
    return (
        <Carousel
            opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
            className="w-full overflow-hidden"
        >
            <CarouselContent className="px-2 sm:px-3 md:px-4 py-4">
                {allItems.map((item, index) => {
                    const isLastItem = index === allItems.length - 1;
                    return (
                        <CarouselItem
                            key={item.id}
                            className="basis-auto pl-2 sm:pl-3 md:pl-4"
                        >
                            <div className="flex items-start justify-center">
                                <div className="group flex w-20 shrink-0 flex-col items-center gap-1.5 text-center">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <Skeleton className="h-3.5 w-16" />
                                </div>
                                {!isLastItem && (
                                    <div className="relative mx-0.5 mt-4 h-1.5 w-5 sm:w-6 md:w-7 lg:w-8 overflow-hidden rounded-full bg-border" />
                                )}
                            </div>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
        </Carousel>
    );
};


export default function ProgressTrail() {
  const { userData, loading } = useUserData();
  const isMobile = useIsMobile();
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="mb-2 h-6 w-1/3" />
        </CardHeader>
        <CardContent className="p-0">
          <TrailSkeleton />
        </CardContent>
      </Card>
    );
  }

  const trailSubmodules = mainTrailDetails.map(sub => ({
    ...sub,
    status: getProgressStatus(userData?.progress, sub.progressKey),
  }));
  const secondaryModules = secondaryModulesDetails.map(mod => ({
    ...mod,
    status: getProgressStatus(userData?.progress, mod.progressKey),
  }));
  let allItems = [...trailSubmodules, ...secondaryModules];
  
  if (isMobile) {
      let activeIndex = allItems.findIndex(s => s.status === 'active');
      if (activeIndex === -1) {
          const firstLockedIndex = allItems.findIndex(s => s.status === 'locked');
          activeIndex = firstLockedIndex > -1 ? firstLockedIndex : allItems.length -1;
      }
      
      let startIndex = Math.max(0, activeIndex - 1);
      let endIndex = startIndex + 3;

      if (endIndex > allItems.length) {
          startIndex = Math.max(0, allItems.length - 3);
          endIndex = allItems.length;
      }
      
      allItems = allItems.slice(startIndex, endIndex);
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold font-headline text-center md:text-left">
          Progresso na Trilha Principal
        </CardTitle>
      </CardHeader>

      <CardContent className={cn("p-0", isMobile && "flex justify-center")}>
        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
            containScroll: 'trimSnaps',
          }}
          className="w-full max-w-full"
        >
          <CarouselContent className={cn("-ml-2 px-2 sm:px-3 md:px-4 py-4", isMobile && "justify-center")}>
            {allItems.map((item, index) => {
              const isSecondary = 'icon' in item;
              let configKey: keyof typeof statusConfig = (item as any).status || 'locked';
              if ((item as any).status === 'completed' && isSecondary) configKey = 'completedSecondary';

              const config = statusConfig[configKey];
              const Icon = isSecondary ? (item as any).icon : config.icon;
              const isLastItem = index === allItems.length - 1;
              const activeIndex = allItems.findIndex(s => s.status === 'active');
              const isNextStep = activeIndex !== -1 && index === activeIndex + 1;

              return (
                <CarouselItem
                  key={item.id}
                  className="basis-auto pl-2"
                >
                  <div className="flex items-start justify-center">
                    <TooltipProvider delayDuration={120}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="group flex w-20 shrink-0 flex-col items-center gap-1.5 text-center">
                            <div
                              className={cn(
                                "grid h-10 w-10 place-items-center rounded-full border transition-all duration-300",
                                config.node,
                                isNextStep && "shadow-lg shadow-primary/40"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <p className="px-1 text-[11px] font-semibold leading-snug text-muted-foreground transition-colors group-hover:text-primary">
                              {item.title}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isNextStep ? "Próximo desafio!" : config.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {!isLastItem && (
                      <div className="relative mx-0.5 mt-4 h-1.5 w-5 sm:w-6 md:w-7 lg:w-8 overflow-hidden rounded-full bg-border">
                        <div
                          className={cn(
                            "absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out",
                            config.line
                          )}
                          style={{ width: (item as any).status === 'completed' ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
}
