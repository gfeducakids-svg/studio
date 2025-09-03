
'use client'

import { Book, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const trailSubmodules = [
    { title: 'Introdução', status: 'completed' },
    { title: 'Pré-Alfabetização', status: 'completed' },
    { title: 'O Alfabeto', status: 'active' },
    { title: 'Sílabas Simples', status: 'locked' },
    { title: 'Método Fônico', status: 'locked' },
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
        node: 'bg-primary/20 border-primary border-2 ring-4 ring-primary/20 text-primary',
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
    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold font-headline mb-6">Progresso na Trilha Principal</h2>
            <div className="relative w-full">
                <div className="flex items-center justify-between">
                    {trailSubmodules.map((submodule, index) => {
                        const config = statusConfig[submodule.status as keyof typeof statusConfig];
                        const Icon = config.icon;
                        const isLast = index === trailSubmodules.length - 1;

                        return (
                            <div key={index} className={cn("flex items-center z-10", isLast ? 'w-auto' : 'w-full')}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="flex flex-col items-center gap-2 group">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300",
                                                    config.node
                                                )}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <p className="text-xs font-semibold text-center text-muted-foreground group-hover:text-primary transition-colors">{submodule.title}</p>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{config.label}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {!isLast && (
                                  <div className="w-full h-1 relative mx-2">
                                    <div className={cn("absolute top-1/2 left-0 h-1 w-full -translate-y-1/2", statusConfig.locked.line)}></div>
                                    <div 
                                      className={cn("absolute top-1/2 left-0 h-1 -translate-y-1/2 transition-all duration-500", config.line)}
                                      style={{ width: submodule.status === 'completed' ? '100%' : '0%' }}
                                    ></div>
                                  </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}

// Re-import Card to be used inside this component
import { Card } from "@/components/ui/card";
