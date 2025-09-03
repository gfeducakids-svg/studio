'use client';
import React, { useState, useEffect } from 'react';
import ModuleCard from '@/components/dashboard/module-card';
import { useUserData } from '@/hooks/use-user-data';
import { BookCheck, Gem, Rocket, Star } from 'lucide-react';

const modules = [
  {
    id: 'grafismo-fonetico',
    title: 'Método Chinês de Grafismo Fonético',
    description: 'A base da alfabetização com um método inovador.',
    icon: Rocket,
  },
  {
    id: 'desafio-21-dias',
    title: 'Desafio 21 Dias de Pronúncia',
    description: 'Aperfeiçoe a pronúncia e a fluidez em 3 semanas.',
    icon: BookCheck,
  },
  {
    id: 'checklist-alfabetizacao',
    title: 'CheckList de Alfabetização',
    description: 'Acompanhe o progresso e identifique pontos de melhoria.',
    icon: Gem,
  },
  {
    id: 'historias-curtas',
    title: 'Histórias Curtas',
    description: 'Pratique a leitura com histórias divertidas e envolventes.',
    icon: Star,
  },
];

export default function DashboardPage() {
  const { userData, loading } = useUserData();

  if (loading) {
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Seus Cursos</h1>
            <p className="text-muted-foreground mb-8">Continue sua jornada para dominar a leitura e a escrita.</p>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <p>Carregando seus cursos...</p>
            </div>
        </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Seus Cursos</h1>
      <p className="text-muted-foreground mb-8">Continue sua jornada para dominar a leitura e a escrita.</p>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((module) => (
          <ModuleCard 
            key={module.id} 
            {...module}
            isUnlocked={userData?.modules?.includes(module.id) ?? false}
          />
        ))}
      </div>
    </div>
  );
}
