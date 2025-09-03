
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, Lock, Play, Paperclip, FileText, Link as LinkIcon, Download, Sparkles, ArrowLeft, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useUserData } from '@/hooks/use-user-data';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { getCourseStructure } from '@/lib/course-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const materialIcons = {
  video: Play,
  pdf: FileText,
  link: LinkIcon,
  download: Download,
  atividade: Paperclip
};

const materialActions = {
  video: "Assistir",
  pdf: "Abrir PDF",
  link: "Acessar Link",
  download: "Baixar",
  atividade: "Iniciar Atividade"
};

const statusConfig = {
    completed: {
        label: 'Concluído',
        node: 'bg-green-500 border-green-200 text-white',
        line: 'bg-green-500',
        icon: Check,
    },
    active: {
        label: 'Ativo',
        node: 'bg-primary border-blue-200 text-white ring-4 ring-primary/20 scale-110',
        line: 'bg-border',
        icon: BookOpen,
    },
    locked: {
        label: 'Bloqueado',
        node: 'bg-muted border-gray-200 text-muted-foreground cursor-not-allowed',
        line: 'bg-border',
        icon: Lock,
    }
}


export default function GrafismoFoneticoPage() {
    const { toast } = useToast();
    const { userData, loading: userLoading } = useUserData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courseStructure, setCourseStructure] = useState<Awaited<ReturnType<typeof getCourseStructure>> | null>(null);
    const [loadingStructure, setLoadingStructure] = useState(true);
    const trailRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const structure = await getCourseStructure('grafismo-fonetico');
                setCourseStructure(structure);
            } catch (error) {
                console.error("Failed to load course structure", error);
            } finally {
                setLoadingStructure(false);
            }
        };
        fetchCourseData();
    }, []);

    const progress = userData?.progress?.['grafismo-fonetico']?.submodules;
    const orderedProgress = courseStructure ? courseStructure.submodules.map(s => ({...s, status: progress?.[s.id]?.status ?? 'locked' })) : [];

    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

    useEffect(() => {
        if (orderedProgress.length > 0) {
            const activeSubmodule = orderedProgress.find(s => s.status === 'active');
            const firstLocked = orderedProgress.find(s => s.status === 'locked');
            if (activeSubmodule) {
                setActiveModuleId(activeSubmodule.id);
            } else if (firstLocked) {
                 setActiveModuleId(firstLocked.id);
            } else {
                setActiveModuleId(orderedProgress[0].id);
            }
        }
    }, [JSON.stringify(orderedProgress)]);

     useEffect(() => {
        if (trailRef.current && activeModuleId) {
            const activeNode = trailRef.current.querySelector(`[data-module-id="${activeModuleId}"]`) as HTMLElement;
            if (activeNode) {
                const scrollContainer = trailRef.current;
                const scrollLeft = activeNode.offsetLeft - (scrollContainer.offsetWidth / 2) + (activeNode.offsetWidth / 2);
                scrollContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, [activeModuleId]);


    if (userLoading || loadingStructure || !activeModuleId || !courseStructure) {
        return (
            <div className="flex flex-col gap-8">
                 <div className="w-full">
                    <Skeleton className="h-10 w-1/3 mb-4" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <div className="flex-1">
                    <Skeleton className="h-full w-full min-h-[70vh]" />
                </div>
            </div>
        );
    }
    
    const activeModule = orderedProgress.find(s => s.id === activeModuleId);
    if (!activeModule) return null;

    const isModuleUnlocked = activeModule.status === 'active' || activeModule.status === 'completed';

    const handleMarkAsCompleted = async (moduleId: string) => {
        const user = auth.currentUser;
        if (!user || !progress) return;

        setIsSubmitting(true);
        const currentModuleIndex = orderedProgress.findIndex(s => s.id === moduleId);
        if (currentModuleIndex === -1) {
            setIsSubmitting(false);
            return;
        };

        const updates: { [key: string]: any } = {};
        updates[`progress.grafismo-fonetico.submodules.${moduleId}.status`] = 'completed';

        if (currentModuleIndex + 1 < orderedProgress.length) {
            const nextModuleId = orderedProgress[currentModuleIndex + 1].id;
            updates[`progress.grafismo-fonetico.submodules.${nextModuleId}.status`] = 'active';
        }

        try {
            const userDocRef = doc(getFirestore(), 'users', user.uid);
            await updateDoc(userDocRef, updates);

            toast({
                title: (
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-yellow-400" />
                        <span className="font-bold">Conquista Desbloqueada!</span>
                    </div>
                ),
                description: `Você concluiu "${activeModule.title}" e desbloqueou o próximo desafio!`,
            });

             if (currentModuleIndex + 1 < orderedProgress.length) {
                setActiveModuleId(orderedProgress[currentModuleIndex + 1].id);
            }

        } catch (error) {
            console.error("Erro ao atualizar o progresso:", error);
            toast({
                title: "Erro",
                description: "Não foi possível salvar seu progresso. Tente novamente.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className="flex flex-col gap-8">
        <div className="w-full">
            <h1 className="text-3xl font-bold font-headline mb-2">{courseStructure.title}</h1>
            <p className="text-muted-foreground mb-6">Siga a trilha do conhecimento e desbloqueie novas aventuras!</p>
             <div ref={trailRef} className="flex items-center justify-start gap-x-4 pb-4 overflow-x-auto no-scrollbar flex-nowrap">
                {orderedProgress.map((submodule, index) => {
                    const config = statusConfig[submodule.status as keyof typeof statusConfig];
                    const Icon = config.icon;
                    const isLast = index === orderedProgress.length - 1;
                    return (
                        <React.Fragment key={submodule.id}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button 
                                            onClick={() => setActiveModuleId(submodule.id)}
                                            disabled={submodule.status === 'locked'}
                                            data-module-id={submodule.id}
                                            className="flex flex-col items-center gap-2 group shrink-0 focus:outline-none"
                                        >
                                            <div className={cn(
                                                "w-16 h-16 rounded-full flex items-center justify-center border-4 shrink-0 transition-all duration-300",
                                                config.node
                                            )}>
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            <p className="text-xs font-semibold text-center text-muted-foreground group-hover:text-primary transition-colors leading-tight px-2">
                                                {submodule.title}
                                            </p>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{config.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {!isLast && (
                                <div className="flex-1 h-1 bg-border rounded-full min-w-12">
                                    <div className={cn("h-full rounded-full transition-all duration-500", submodule.status === 'completed' ? 'bg-green-500' : 'bg-border')} style={{width: submodule.status === 'completed' ? '100%' : '0%'}}></div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
      
      <div className="flex-1">
        <Card className="min-h-full">
            <CardHeader>
                <Button variant="ghost" className="self-start mb-4" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para os Cursos
                    </Link>
                </Button>
                <CardTitle className="text-2xl font-bold font-headline">
                {activeModule.title}
                </CardTitle>
                {!isModuleUnlocked && <CardDescription className="text-destructive font-semibold">Conteúdo bloqueado — conclua a etapa anterior para liberar.</CardDescription>}
            </CardHeader>
          <CardContent>
            <Tabs defaultValue="aula" className="relative">
             {!isModuleUnlocked && <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                 <div className="flex flex-col items-center gap-2 text-muted-foreground font-bold">
                    <Lock size={32}/>
                    <span>Conteúdo bloqueado</span>
                 </div>
              </div>}

              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="aula">Aula</TabsTrigger>
                <TabsTrigger value="atividades">Atividades</TabsTrigger>
              </TabsList>
              
              <TabsContent value="aula" className="mt-6">
                <div className="bg-muted rounded-lg w-full min-h-[80vh] flex flex-col">
                    {activeModule.imageUrl ? (
                         <embed
                            src={activeModule.imageUrl}
                            type="application/pdf"
                            className="w-full h-full min-h-[80vh] rounded-md shadow-inner"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                            <FileText size={48} className="mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Aula em Preparação</h3>
                            <p>O conteúdo principal para este submódulo ainda não está disponível.</p>
                        </div>
                    )}
                </div>
                 {isModuleUnlocked && activeModule.status !== 'completed' && (
                    <div className="mt-6 flex justify-center">
                        <Button 
                            onClick={() => handleMarkAsCompleted(activeModule.id)}
                            disabled={isSubmitting}
                            size="lg"
                            className="font-bold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full px-10 py-6"
                        >
                            {isSubmitting ? 'Salvando...' : "Marcar como concluído"}
                        </Button>
                    </div>
                )}
                 {activeModule.status === 'completed' && (
                     <div className="mt-6 flex justify-center">
                        <Button
                            disabled={true}
                            size="lg"
                            className="font-bold text-lg shadow-lg rounded-full px-10 py-6 bg-green-500 hover:bg-green-500 cursor-not-allowed"
                        >
                            Concluído <Check className="ml-2 h-5 w-5"/>
                        </Button>
                    </div>
                )}
              </TabsContent>
              <TabsContent value="atividades" className="mt-6">
                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeModule.materials.length > 0 ? activeModule.materials.map(material => {
                      const Icon = materialIcons[material.type as keyof typeof materialIcons] || Paperclip;
                      const actionText = materialActions[material.type as keyof typeof materialActions] || "Acessar";
                      return (
                        <Card key={material.id} className="flex flex-col h-full group/material-card">
                           <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                            <Icon className="h-6 w-6 text-primary" />
                            <CardTitle className="text-base font-semibold leading-tight">{material.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow pt-2">
                             <p className="text-sm text-muted-foreground capitalize">{material.type}</p>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" size="sm" disabled={!isModuleUnlocked}>
                               {actionText}
                            </Button>
                          </CardFooter>
                        </Card>
                      )
                  }) : (
                     <div className="col-span-full p-8 bg-muted rounded-lg flex flex-col items-center justify-center text-center min-h-[25vh]">
                        <Paperclip size={32} className="mb-4 text-muted-foreground"/>
                        <p className="text-muted-foreground font-semibold">Nenhuma atividade adicional para este submódulo.</p>
                        <p className="text-xs text-muted-foreground">Volte para a aba "Aula" para ver o conteúdo principal.</p>
                    </div>
                  )}
                 </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
