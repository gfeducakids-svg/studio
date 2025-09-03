import AchievementCard from '@/components/dashboard/achievement-card';
import { Book, Feather, PenTool, Sparkles, Star, Trophy } from 'lucide-react';

const achievements = [
  {
    title: 'Pequeno Explorador',
    description: 'Concluiu a Introdução.',
    icon: Star,
    rarity: 'common',
    isUnlocked: true,
  },
  {
    title: 'Mestre dos Traços',
    description: 'Completou a Pré-Alfabetização.',
    icon: PenTool,
    rarity: 'common',
    isUnlocked: true,
  },
  {
    title: 'Guardião do Alfabeto',
    description: 'Apresentado a todas as formas e sons.',
    icon: Book,
    rarity: 'uncommon',
    isUnlocked: true,
  },
  {
    title: 'Sussurrador de Sílabas',
    description: 'Dominou as Sílabas Simples.',
    icon: Feather,
    rarity: 'uncommon',
    isUnlocked: false,
  },
  {
    title: 'Arquiteto de Palavras',
    description: 'Tornou-se um mestre na Formação de Palavras.',
    icon: Trophy,
    rarity: 'epic',
    isUnlocked: false,
  },
  {
    title: 'Lenda do Grafismo Fonético',
    description: 'Completou todos os módulos e se tornou um mestre.',
    icon: Sparkles,
    rarity: 'legendary',
    isUnlocked: false,
  },
];

export default function AchievementsPage() {
  return (
    <div className="animate-in">
      <h1 className="text-3xl font-bold font-headline mb-2">Suas Conquistas</h1>
      <p className="text-muted-foreground mb-8">Cada passo na jornada do conhecimento é uma vitória!</p>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {achievements.map((achievement, index) => (
          <div key={index} className="animate-in" style={{ animationDelay: `${index * 100}ms` }}>
            <AchievementCard {...achievement} />
          </div>
        ))}
      </div>
    </div>
  );
}
