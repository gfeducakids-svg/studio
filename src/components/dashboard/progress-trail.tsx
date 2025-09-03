
'use client'

import React from 'react';
import { Book, Check, Star, Trophy, ClipboardCheck, CalendarDays, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useUserData } from "@/hooks/use-user-data";
import { Skeleton } from "../ui/skeleton";

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
]

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
}

const getProgressStatus = (progress: any, progressKey: string) => {
    if (!progress || !progressKey) return 'locked';

    const keys = progressKey.split('.');
    let currentProgress = progress;

    for (const key of keys) {
        if (currentProgress && typeof currentProgress === 'object' && key in currentProgress) {
            currentProgress = currentProgress[key];
        } else {
            return 'locked';
        }
    }
    
    if (typeof currentProgress === 'object' && currentProgress !== null && 'status' in currentProgress) {
        return currentProgress.status;
    }

    return 'locked';
};


export default function ProgressTrail() {
    const { userData, loading } = useUserData();

    if (loading) {
        return (
            <div className="p-4 md:p-6">
                <Skeleton className="h-6 w-1/3 mb-6 mx-auto md:mx-0" />
                <div className="flex items-center">
                    {Array(5).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                           <div className="flex flex-col items-center gap-2">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <Skeleton className="h-4 w-20" />
                           </div>
                           {index < 4 && <Skeleton className="h-1 flex-1 mx-2" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        )
    }

    const trailSubmodules = mainTrailDetails.map(sub => ({
        ...sub,
        status: getProgressStatus(userData?.progress, sub.progressKey)
    }));
    
    const secondaryModules = secondaryModulesDetails.map(mod => ({
        ...mod,
        status: getProgressStatus(userData?.progress, mod.progressKey)
    }));

    const allItems = [...trailSubmodules, ...secondaryModules];

    const activeIndex = trailSubmodules.findIndex(s => s.status === 'active');

    return (
        <div className="py-6">
            <h2 className="text-xl font-bold font-headline mb-6 text-center md:text-left">Progresso na Trilha Principal</h2>
            <Carousel
              opts={{
                align: "start",
                slidesToScroll: "auto",
              }}
              className="w-full"
            >
              <CarouselContent>
                {allItems.map((item, index) => {
                    const isSecondary = 'icon' in item;
                    let configKey = item.status as keyof typeof statusConfig;

                    if (item.status === 'completed' && isSecondary) {
                        configKey = 'completedSecondary';
                    }
                    
                    const config = statusConfig[configKey];
                    const Icon = isSecondary ? item.icon : config.icon;
                    const isLast = index === allItems.length - 1;
                    const isNextStep = activeIndex !== -1 && index === activeIndex + 1;

                    return (
                        <CarouselItem key={item.id} className="basis-1/4 md:basis-1/5 lg:basis-1/6">
                           <div className="flex items-start justify-center">
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-col items-center text-center gap-2 group w-[60px] md:w-[80px] shrink-0">
                                            <div className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300",
                                                config.node,
                                                isNextStep && 'shadow-lg shadow-primary/40'
                                            )}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <p className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors leading-tight">{item.title}</p>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isNextStep ? "Próximo desafio!" : config.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {!isLast && (
                              <div className="flex-1 h-1.5 bg-border rounded-full mx-2 mt-5 relative overflow-hidden w-full">
                                <div 
                                  className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out", config.line)}
                                  style={{ width: item.status === 'completed' ? '100%' : '0%' }}
                                ></div>
                              </div>
                            )}
                           </div>
                        </CarouselItem>
                    );
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
        </div>
    );
}
