import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  rarity: 'common' | 'uncommon' | 'epic' | 'legendary';
  isUnlocked: boolean;
}

const rarityStyles = {
  common: 'border-gray-300 bg-gray-100 text-gray-800 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200',
  uncommon: 'border-blue-300 bg-blue-100 text-blue-800 shadow-md shadow-blue-500/20 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200',
  epic: 'border-purple-300 bg-purple-100 text-purple-800 shadow-lg shadow-purple-500/30 dark:bg-purple-900/50 dark:border-purple-700 dark:text-purple-200',
  legendary: 'border-amber-400 bg-amber-100 text-amber-800 shadow-xl shadow-amber-500/40 animate-pulse-slow dark:bg-amber-900/50 dark:border-amber-600 dark:text-amber-200',
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
      'flex flex-col text-center transition-all duration-300 ease-out relative overflow-hidden group h-full',
      isUnlocked 
        ? `${rarityStyles[rarity]} transform hover:scale-105 hover:-translate-y-1`
        : 'bg-card/50 dark:bg-card/30' // Desabilitado
    )}>
       {rarity === 'legendary' && isUnlocked && (
         <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-amber-500/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
       )}
       <CardHeader className="flex-1 flex flex-col items-center justify-center pt-6 pb-2 z-10">
        <div className={cn('flex h-16 w-16 items-center justify-center rounded-full mb-2 transition-colors', isUnlocked ? 'bg-primary/10 dark:bg-primary/20' : 'bg-muted dark:bg-muted/50')}>
          <Icon className={cn('h-8 w-8 transition-colors', isUnlocked ? 'text-primary' : 'text-muted-foreground/50')} />
        </div>
        <CardTitle className={cn("font-headline text-md leading-tight", !isUnlocked && "text-muted-foreground")}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-0 z-10">
        <CardDescription className={cn("text-xs mb-4", !isUnlocked && "text-muted-foreground/70")}>{description}</CardDescription>
        <Badge variant="outline" className={cn(
          "font-semibold transition-colors w-min mx-auto", 
          isUnlocked ? rarityStyles[rarity] : 'bg-muted text-muted-foreground border-border'
        )}>
            {rarityNames[rarity]}
        </Badge>
      </CardContent>
       {!isUnlocked && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg">
              <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
       )}
    </Card>
  );
}
