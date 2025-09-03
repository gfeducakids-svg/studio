'use client'

import React from 'react';
import { Check, Lock, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const submodules = [
  { id: 'intro', title: 'Introdução', completed: true },
  { id: 'pre-alf', title: 'Pré-Alfabetização', completed: true },
  { id: 'alfabeto', title: 'Apresentando o Alfabeto', completed: false, active: true },
  { id: 'silabas', title: 'Sílabas Simples', completed: false },
  { id: 'fonico', title: 'Método Fônico', completed: false },
  { id: 'palavras', title: 'Formação de Palavras e Frases', completed: false },
  { id: 'escrita', title: 'Escrita e Compreensão Leitora', completed: false },
  { id: 'bonus', title: 'Bônus', completed: false },
];

export default function GrafismoFoneticoPage() {
    const activeModule = submodules.find(s => s.active);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Trilha de Progresso */}
      <div className="lg:w-1/3">
        <h1 className="text-3xl font-bold font-headline mb-2">Método de Grafismo Fonético</h1>
        <p className="text-muted-foreground mb-8">Siga a trilha do conhecimento e desbloqueie novas aventuras!</p>
        
        <div className="relative pl-5">
          {/* Linha vertical da trilha */}
          <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-border -z-10"></div>
          
          {submodules.map((submodule, index) => (
            <div key={submodule.id} className="flex items-center gap-4 mb-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-4 shrink-0 transition-colors cursor-pointer",
                submodule.completed ? 'bg-green-500 border-green-200 text-white' : 
                submodule.active ? 'bg-primary border-blue-200 text-white' : 
                'bg-muted border-gray-200 text-muted-foreground'
              )}>
                {submodule.completed ? <Check /> : <Lock size={20}/>}
              </div>
              <p className={cn(
                  "font-semibold",
                  submodule.active ? "text-primary-foreground" :
                  !submodule.completed && !submodule.active ? "text-muted-foreground" : ""
              )}>
                {submodule.title}
              </p>
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
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="aula">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="aula">Aula</TabsTrigger>
                <TabsTrigger value="exercicios">Exercícios</TabsTrigger>
              </TabsList>
              <TabsContent value="aula" className="mt-6">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <Play size={48} className="mx-auto mb-2"/>
                        <p>Vídeo da aula em breve.</p>
                    </div>
                </div>
              </TabsContent>
              <TabsContent value="exercicios" className="mt-6">
                <div className="p-8 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Exercícios interativos em breve.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
