import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isUnlocked: boolean;
}

export default function AchievementCard({ title, description, icon: Icon, isUnlocked }: AchievementCardProps) {
  return (
    <Card className={cn(
      'text-center transition-transform hover:scale-105 hover:shadow-lg',
      !isUnlocked && 'bg-card/50 opacity-60'
    )}>
      <CardHeader className="items-center">
        <div className={cn('flex h-16 w-16 items-center justify-center rounded-full', isUnlocked ? 'bg-primary/10' : 'bg-muted')}>
          <Icon className={cn('h-8 w-8', isUnlocked ? 'text-primary' : 'text-muted-foreground')} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardTitle className="font-headline text-md mb-1">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
