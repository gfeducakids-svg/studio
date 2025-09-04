
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
import { useUserData } from "@/hooks/use-user-data";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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

const getProgressStatus = (progress: any, progressKey: string): 'locked' | 'active' | 'completed' => {
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
        const status = currentProgress.status;
        if (status === 'locked' || status === 'active' || status === 'completed') {
            return status;
        }
    }

    return 'locked';
};


export default function ProgressTrail() {
    const { userData, loading } = useUserData();

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center">
                        {Array(5).fill(0).map((_, index) => (
                            <React.Fragment key={index}>
                               <div className="flex flex-col items-center gap-2 px-2">
                                    <Skeleton className="w-12 h-12 rounded-full" />
                                    <Skeleton className="h-4 w-20" />
                               </div>
                               {index < 4 && <Skeleton className="h-1 flex-1 mx-2" />}
                            </React.Fragment>
                        ))}
                    </div>
                </CardContent>
            </Card>
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
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold font-headline text-center md:text-left">Progresso na Trilha Principal</CardTitle>
            </CardHeader>
            <CardContent>
               <div
                    className="
                        no-scrollbar -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4
                        md:mx-0 md:w-auto md:overflow-visible
                    "
                    >
                    <div
                        className="
                        inline-flex min-w-max items-start gap-x-2 gap-y-4 whitespace-nowrap
                        md:flex md:min-w-0 md:flex-wrap md:justify-center md:whitespace-normal
                        "
                    >
                        {allItems.map((item, index) => {
                            const isSecondary = 'icon' in item;
                            let configKey: keyof typeof statusConfig = (item.status as any) || 'locked';

                            if (item.status === 'completed' && isSecondary) {
                                configKey = 'completedSecondary';
                            }
                            
                            const config = statusConfig[configKey];
                            const Icon = isSecondary ? (item as any).icon : config.icon;
                            const isLastItem = index === allItems.length - 1;
                            const isNextStep = activeIndex !== -1 && index === activeIndex + 1;

                            return (
                                <div key={item.id} className="flex items-start justify-center">
                                <TooltipProvider delayDuration={150}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="group flex w-24 shrink-0 flex-col items-center gap-2 text-center">
                                                <div className={cn(
                                                    "grid h-12 w-12 place-items-center rounded-full border transition-all duration-300",
                                                    config.node,
                                                    isNextStep && 'shadow-lg shadow-primary/40'
                                                )}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <p className="px-1 text-xs font-semibold leading-tight text-muted-foreground transition-colors group-hover:text-primary">{item.title}</p>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isNextStep ? "Próximo desafio!" : config.label}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {!isLastItem && (
                                <div className="relative mx-1 mt-5 h-1.5 w-6 overflow-hidden rounded-full bg-border md:w-10">
                                    <div 
                                    className={cn("absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out", config.line)}
                                    style={{ width: item.status === 'completed' ? '100%' : '0%' }}
                                    ></div>
                                </div>
                                )}
                            </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

