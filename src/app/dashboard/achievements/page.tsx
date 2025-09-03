
'use client';

import AchievementCard from '@/components/dashboard/achievement-card';
import { Book, Feather, PenTool, Sparkles, Star, Trophy, Puzzle, BrainCircuit, Target, Crown, CalendarDays, ClipboardCheck, Film } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import { Skeleton } from '@/components/ui/skeleton';

const staticAchievements = [
  // Módulo: Método Chinês de Grafismo Fonético
  {
    id: 'grafismo-intro',
    title: 'Pequeno Explorador',
    description: 'Concluiu a Introdução do Grafismo Fonético.',
    icon: Star,
    rarity: 'common',
    progressKey: 'grafismo-fonetico.submodules.intro',
  },
  {
    id: 'grafismo-pre-alf',
    title: 'Mestre dos Traços',
    description: 'Completou a Pré-Alfabetização.',
    icon: PenTool,
    rarity: 'common',
    progressKey: 'grafismo-fonetico.submodules.pre-alf',
  },
  {
    id: 'grafismo-alfabeto',
    title: 'Guardião do Alfabeto',
    description: 'Apresentado a todas as formas e sons.',
    icon: Book,
    rarity: 'common',
    progressKey: 'grafismo-fonetico.submodules.alfabeto',
  },
  {
    id: 'grafismo-silabas',
    title: 'Sussurrador de Sílabas',
    description: 'Dominou as Sílabas Simples.',
    icon: Feather,
    rarity: 'common',
    progressKey: 'grafismo-fonetico.submodules.silabas',
  },
    {
    id: 'grafismo-fonico',
    title: 'Mestre do Som',
    description: 'Concluiu o módulo do Método Fônico.',
    icon: BrainCircuit,
    rarity: 'uncommon',
    progressKey: 'grafismo-fonetico.submodules.fonico',
  },
  {
    id: 'grafismo-palavras',
    title: 'Arquiteto de Palavras',
    description: 'Tornou-se hábil na Formação de Palavras.',
    icon: Puzzle,
    rarity: 'uncommon',
    progressKey: 'grafismo-fonetico.submodules.palavras',
  },
  {
    id: 'grafismo-escrita',
    title: 'Mestre da Escrita',
    description: 'Completou o módulo de Escrita e Leitura.',
    icon: Trophy,
    rarity: 'epic',
    progressKey: 'grafismo-fonetico.submodules.escrita',
  },
  // Novas conquistas lendárias para os outros módulos
  {
    id: 'desafio-21-dias',
    title: 'Lenda da Pronúncia',
    description: 'Concluiu o Desafio de 21 Dias de Pronúncia.',
    icon: CalendarDays,
    rarity: 'legendary',
    progressKey: 'desafio-21-dias',
  },
  {
    id: 'checklist-alfabetizacao',
    title: 'Mestre Alfabetizador',
    description: 'Completou o Checklist de Alfabetização.',
    icon: ClipboardCheck,
    rarity: 'legendary',
    progressKey: 'checklist-alfabetizacao',
  },
  {
    id: 'historias-curtas',
    title: 'Contador de Histórias',
    description: 'Devorou todas as Histórias Curtas.',
    icon: Film,
    rarity: 'legendary',
    progressKey: 'historias-curtas',
  },
  // Conquista final
  {
    id: 'mestre-total',
    title: 'Aventureiro da Alfabetização',
    description: 'Completou todos os módulos e se tornou um mestre.',
    icon: Crown,
    rarity: 'legendary',
    progressKey: 'mestre-total', // Um placeholder, a lógica pode ser mais complexa
  },
];

const AchievementSkeleton = () => (
    <div className="flex flex-col text-center items-center gap-2 p-4 rounded-lg bg-card border border-border">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-6 w-1/2 rounded-full" />
    </div>
);


export default function AchievementsPage() {
  const { userData, loading } = useUserData();

  const getProgressStatus = (progressKey: string) => {
    if (!userData?.progress || !progressKey) return false;

    const keys = progressKey.split('.');
    let currentProgress: any = userData.progress;

    for (const key of keys) {
      if (currentProgress && typeof currentProgress === 'object' && key in currentProgress) {
        currentProgress = currentProgress[key];
      } else {
        return false;
      }
    }
    
    // Se a chave final for um módulo, verificamos o status dele.
    // Se for um submódulo, também verificamos.
    if (typeof currentProgress === 'object' && currentProgress !== null && 'status' in currentProgress) {
        return currentProgress.status === 'completed';
    }

    // Caso especial para o mestre total
    if(progressKey === 'mestre-total') {
        return Object.values(userData.progress).every(m => m.status === 'completed');
    }

    return false;
  };
  
  if (loading) {
     return (
        <div className="animate-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Suas Conquistas</h1>
            <p className="text-muted-foreground">Cada passo na jornada do conhecimento é uma vitória! Continue assim.</p>
          </div>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => <AchievementSkeleton key={index} />)}
          </div>
        </div>
      );
  }

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2">Suas Conquistas</h1>
        <p className="text-muted-foreground">Cada passo na jornada do conhecimento é uma vitória! Continue assim.</p>
      </div>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {staticAchievements.map((achievement, index) => (
          <div key={achievement.id} className="animate-in" style={{ animationDelay: `${index * 100}ms` }}>
            <AchievementCard 
              {...achievement} 
              isUnlocked={getProgressStatus(achievement.progressKey)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
