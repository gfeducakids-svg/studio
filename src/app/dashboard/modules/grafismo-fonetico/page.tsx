'use client'

import React from 'react';
import { Check, Lock, Play, Paperclip, FileText, Link as LinkIcon, Download, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const submodules = [
  { id: 'intro', title: 'Introdução', completed: true, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', materials: [{ id: 1, type: 'video', title: 'Boas-vindas'}] },
  { id: 'pre-alf', title: 'Pré-Alfabetização', completed: true, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', materials: [{ id: 1, type: 'video', title: 'Aula 1'}, {id: 2, type: 'pdf', title: 'Exercício de Traços'}] },
  { id: 'alfabeto', title: 'Apresentando o Alfabeto', completed: false, active: true, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', materials: [{ id: 1, type: 'video', title: 'As Vogais'}, {id: 2, type: 'pdf', title: 'Cartilha do Alfabeto'}, {id: 3, type: 'download', title: 'Áudios das Letras'}] },
  { id: 'silabas', title: 'Sílabas Simples', completed: false, pdfUrl: null, materials: [{ id: 1, type: 'video', title: 'BA-BE-BI-BO-BU'}, {id: 2, type: 'pdf', title: 'Tabela de Sílabas'}] },
  { id: 'fonico', title: 'Método Fônico', completed: false, pdfUrl: null, materials: [] },
  { id: 'palavras', title: 'Formação de Palavras e Frases', completed: false, pdfUrl: null, materials: [] },
  { id: 'escrita', title: 'Escrita e Compreensão Leitora', completed: false, pdfUrl: null, materials: [] },
  { id: 'bonus', title: 'Bônus', completed: false, pdfUrl: null, materials: [] },
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
    const activeModule = submodules.find(s => s.active) ?? submodules[0];
    const isModuleUnlocked = activeModule.completed || activeModule.active;

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
               <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-4 shrink-0 transition-colors cursor-pointer z-10",
                submodule.completed ? 'bg-green-500 border-green-200 text-white' : 
                submodule.active ? 'bg-primary border-blue-200 text-white' : 
                'bg-muted border-gray-200 text-muted-foreground'
              )}>
                {submodule.completed ? <Check /> : <Lock size={20}/>}
              </div>
              <div className="flex-1">
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
            <CardTitle className="text-2xl font-bold font-headline">
              {activeModule ? activeModule.title : "Selecione um módulo"}
            </CardTitle>
            {!isModuleUnlocked && <CardDescription className="text-destructive font-semibold">Conteúdo bloqueado — conclua a etapa anterior para liberar.</CardDescription>}
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="aula" className={!isModuleUnlocked ? 'opacity-50 pointer-events-none' : ''}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="aula">Aula</TabsTrigger>
                <TabsTrigger value="materiais">Materiais Extras</TabsTrigger>
              </TabsList>
              <TabsContent value="aula" className="mt-6">
                <div className="bg-muted rounded-lg w-full h-[80vh] md:h-[100vh] lg:h-[80vh]">
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
              </TabsContent>
              <TabsContent value="materiais" className="mt-6">
                 <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {activeModule.materials.length > 0 ? activeModule.materials.map(material => {
                      const Icon = materialIcons[material.type as keyof typeof materialIcons] || Paperclip;
                      const actionText = materialActions[material.type as keyof typeof materialActions] || "Acessar";
                      return (
                        <Card key={material.id} className="flex flex-col">
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
                     <div className="col-span-full p-8 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Nenhum material adicional para este submódulo.</p>
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
