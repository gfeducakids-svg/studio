
'use client'

import { Book, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUserData } from "@/hooks/use-user-data";
import { Skeleton } from "../ui/skeleton";
import { Card } from "@/components/ui/card";

const submoduleDetails = [
    { id: 'intro', title: 'Introdução' },
    { id: 'pre-alf', title: 'Pré-Alfabetização' },
    { id: 'alfabeto', title: 'O Alfabeto' },
    { id: 'silabas', title: 'Sílabas Simples' },
    { id: 'fonico', title: 'Método Fônico' },
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
    }
}

export default function ProgressTrail() {
    const { userData, loading } = useUserData();

    if (loading) {
        return (
            <div className="p-6">
                <Skeleton className="h-6 w-1/3 mb-6" />
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

    const progress = userData?.progress?.['grafismo-fonetico']?.submodules;
    const trailSubmodules = submoduleDetails.map(sub => ({
        ...sub,
        status: progress?.[sub.id]?.status ?? 'locked'
    }));

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-xl font-bold font-headline mb-6 text-center md:text-left">Progresso na Trilha Principal</h2>
            <div className="w-full">
                <div className="flex items-start justify-between">
                    {trailSubmodules.map((submodule, index) => {
                        const config = statusConfig[submodule.status as keyof typeof statusConfig];
                        const Icon = config.icon;
                        const isLast = index === trailSubmodules.length - 1;

                        return (
                            <React.Fragment key={submodule.id}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex flex-col items-center text-center gap-2 group w-[60px] md:w-[80px] shrink-0">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300",
                                                    config.node
                                                )}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <p className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors leading-tight">{submodule.title}</p>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{config.label}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {!isLast && (
                                  <div className="flex-1 h-1.5 bg-border rounded-full mx-2 mt-5 relative overflow-hidden">
                                    <div 
                                      className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out", config.line)}
                                      style={{ width: submodule.status === 'completed' ? '100%' : '0%' }}
                                    ></div>
                                  </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
