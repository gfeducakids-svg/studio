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

const rarityColors = {
  common: 'bg-gray-200 text-gray-800 border-gray-300',
  uncommon: 'bg-green-200 text-green-800 border-green-300',
  epic: 'bg-purple-200 text-purple-800 border-purple-300',
  legendary: 'bg-yellow-200 text-yellow-800 border-yellow-300',
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
      'text-center transition-transform hover:scale-105 hover:shadow-lg relative overflow-hidden',
      !isUnlocked && 'bg-card/50 opacity-60'
    )}>
       <CardHeader className="items-center pb-2">
        <div className={cn('flex h-16 w-16 items-center justify-center rounded-full mb-2', isUnlocked ? 'bg-primary/10' : 'bg-muted')}>
          <Icon className={cn('h-8 w-8', isUnlocked ? 'text-primary' : 'text-muted-foreground')} />
        </div>
        <CardTitle className="font-headline text-md leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs mb-3">{description}</CardDescription>
        <Badge variant="outline" className={cn("font-semibold", isUnlocked ? rarityColors[rarity] : 'bg-muted text-muted-foreground')}>
            {rarityNames[rarity]}
        </Badge>
      </CardContent>
    </Card>
  );
}
