
'use client'

import React, { useState } from 'react';
import { Check, Lock, Play, Paperclip, FileText, Link as LinkIcon, Download, Sparkles, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const initialSubmodules = [
  { id: 'intro', title: 'Introdução', completed: false, active: true, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', materials: [{ id: 1, type: 'video', title: 'Boas-vindas'}] },
  { id: 'pre-alf', title: 'Pré-Alfabetização', completed: false, active: false, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', materials: [{ id: 1, type: 'video', title: 'Aula 1'}, {id: 2, type: 'pdf', title: 'Exercício de Traços'}] },
  { id: 'alfabeto', title: 'Apresentando o Alfabeto', completed: false, active: false, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', materials: [{ id: 1, type: 'video', title: 'As Vogais'}, {id: 2, type: 'pdf', title: 'Cartilha do Alfabeto'}, {id: 3, type: 'download', title: 'Áudios das Letras'}] },
  { id: 'silabas', title: 'Sílabas Simples', completed: false, active: false, pdfUrl: null, materials: [{ id: 1, type: 'video', title: 'BA-BE-BI-BO-BU'}, {id: 2, type: 'pdf', title: 'Tabela de Sílabas'}] },
  { id: 'fonico', title: 'Método Fônico', completed: false, active: false, pdfUrl: null, materials: [] },
  { id: 'palavras', title: 'Formação de Palavras e Frases', completed: false, active: false, pdfUrl: null, materials: [] },
  { id: 'escrita', title: 'Escrita e Compreensão Leitora', completed: false, active: false, pdfUrl: null, materials: [] },
  { id: 'bonus', title: 'Bônus', completed: false, active: false, pdfUrl: null, materials: [] },
];

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


export default function GrafismoFoneticoPage() {
    const { toast } = useToast();
    const [submodules, setSubmodules] = useState(initialSubmodules);
    const [activeModuleId, setActiveModuleId] = useState(initialSubmodules.find(s => s.active)?.id ?? initialSubmodules[0].id);

    const activeModule = submodules.find(s => s.id === activeModuleId);
    if (!activeModule) return null; // ou uma tela de erro/carregamento

    const isModuleUnlocked = activeModule.completed || activeModule.active;

    const handleMarkAsCompleted = (moduleId: string) => {
        const currentModuleIndex = submodules.findIndex(s => s.id === moduleId);
        if (currentModuleIndex === -1) return;

        // Atualiza a lista de submódulos
        const updatedSubmodules = submodules.map((submodule, index) => {
            if (index === currentModuleIndex) {
                return { ...submodule, completed: true, active: false };
            }
            if (index === currentModuleIndex + 1) {
                return { ...submodule, active: true };
            }
            return submodule;
        });

        setSubmodules(updatedSubmodules);

        // Avança para o próximo módulo
        if (currentModuleIndex + 1 < updatedSubmodules.length) {
            setActiveModuleId(updatedSubmodules[currentModuleIndex + 1].id);
        }

        // Mostra notificação de conquista
        toast({
            title: (
                <div className="flex items-center gap-2">
                    <Sparkles className="text-yellow-400" />
                    <span className="font-bold">Conquista Desbloqueada!</span>
                </div>
            ),
            description: `Você concluiu "${submodules[currentModuleIndex].title}" e desbloqueou o próximo desafio!`,
        });
    };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Trilha de Progresso */}
      <div className="lg:w-1/3">
        <h1 className="text-3xl font-bold font-headline mb-2">Método de Grafismo Fonético</h1>
        <p className="text-muted-foreground mb-8">Siga a trilha do conhecimento e desbloqueie novas aventuras!</p>
        
        <div className="relative pl-5">
          {/* Linha vertical da trilha */}
          <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-border -z-10"></div>
          
          {submodules.map((submodule) => (
            <div key={submodule.id} className="flex items-start gap-4 mb-4">
               <button onClick={() => setActiveModuleId(submodule.id)} className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-4 shrink-0 transition-all duration-300 z-10",
                submodule.completed ? 'bg-green-500 border-green-200 text-white hover:bg-green-600' : 
                submodule.active ? 'bg-primary border-blue-200 text-white ring-4 ring-primary/20 hover:bg-primary/90' : 
                'bg-muted border-gray-200 text-muted-foreground cursor-not-allowed'
              )}>
                {submodule.completed ? <Check /> : <Lock size={20}/>}
              </button>
              <div className="flex-1 pt-1">
                <p className={cn(
                    "font-semibold",
                    submodule.active ? "text-primary" :
                    !submodule.completed && !submodule.active ? "text-muted-foreground" : ""
                )}>
                  {submodule.title}
                </p>
                 <p className="text-xs text-muted-foreground">
                  {submodule.materials.length > 0 
                    ? `${submodule.materials.length} material${submodule.materials.length > 1 ? 's' : ''}` 
                    : "Nenhum material"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo do Submódulo */}
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
                <div className="bg-muted rounded-lg w-full h-[80vh] md:h-[100vh] lg:h-[80vh] flex flex-col">
                    {activeModule.pdfUrl ? (
                         <embed
                            src={activeModule.pdfUrl}
                            type="application/pdf"
                            className="w-full h-full rounded-md shadow-inner"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                            <FileText size={48} className="mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Aula em Preparação</h3>
                            <p>O conteúdo principal para este submódulo ainda não está disponível.</p>
                        </div>
                    )}
                </div>
                 {isModuleUnlocked && (
                    <div className="mt-6 flex justify-center">
                        <Button 
                            onClick={() => handleMarkAsCompleted(activeModule.id)}
                            disabled={activeModule.completed}
                            size="lg"
                            className="font-bold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full px-10 py-6"
                        >
                            {activeModule.completed ? (
                                <>Concluído <Check className="ml-2 h-5 w-5"/></>
                            ) : (
                                "Marcar como concluído"
                            )}
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
                        <Card key={material.id} className="flex flex-col group/material-card">
                           <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                            <Icon className="h-6 w-6 text-primary" />
                            <CardTitle className="text-base font-semibold leading-tight">{material.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow pt-2">
                             <p className="text-sm text-muted-foreground capitalize">{material.type}</p>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" size="sm">
                               {actionText}
                            </Button>
                          </CardFooter>
                        </Card>
                      )
                  }) : (
                     <div className="col-span-full p-8 bg-muted rounded-lg flex flex-col items-center justify-center text-center">
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

