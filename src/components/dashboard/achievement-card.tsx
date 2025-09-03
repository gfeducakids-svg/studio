import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  rarity: 'common' | 'uncommon' | 'epic' | 'legendary';
  isUnlocked: boolean;
}

const rarityStyles = {
  common: 'border-gray-300 bg-gray-100 text-gray-800 shadow-sm',
  uncommon: 'border-green-300 bg-green-100 text-green-800 shadow-green-500/20 shadow-md',
  epic: 'border-purple-300 bg-purple-100 text-purple-800 shadow-purple-500/30 shadow-lg',
  legendary: 'border-amber-300 bg-amber-100 text-amber-800 shadow-amber-500/40 shadow-xl animate-pulse',
};

const rarityNames = {
    common: 'Comum',
    uncommon: 'Incomum',
    epic: 'Épica',
    legendary: 'Lendária'
}

export default function AchievementCard({ title, description, icon: Icon, rarity, isUnlocked }: AchievementCardProps) {
  return (
    <Card className={cn(
      'text-center transition-all duration-300 ease-out relative overflow-hidden group',
      isUnlocked 
        ? `${rarityStyles[rarity]} transform hover:scale-105 hover:-translate-y-1`
        : 'bg-card/50 opacity-60 grayscale'
    )}>
       {isUnlocked && rarity === 'legendary' && (
         <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-amber-500/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
       )}
       <CardHeader className="items-center pb-2 z-10">
        <div className={cn('flex h-16 w-16 items-center justify-center rounded-full mb-2 transition-colors', isUnlocked ? 'bg-primary/10' : 'bg-muted')}>
          <Icon className={cn('h-8 w-8 transition-colors', isUnlocked ? 'text-primary' : 'text-muted-foreground')} />
        </div>
        <CardTitle className="font-headline text-md leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 z-10">
        <CardDescription className="text-xs mb-3">{description}</CardDescription>
        <Badge variant="outline" className={cn(
          "font-semibold transition-colors", 
          isUnlocked ? rarityStyles[rarity] : 'bg-muted text-muted-foreground'
        )}>
            {rarityNames[rarity]}
        </Badge>
      </CardContent>
    </Card>
  );
}
