import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  isUnlocked: boolean;
}

export default function ModuleCard({ id, title, description, icon: Icon, isUnlocked }: ModuleCardProps) {
  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-headline text-lg leading-tight">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        {isUnlocked ? (
          <Button asChild className="w-full">
            <Link href={`/dashboard/modules/${id}`}>Acessar Conteúdo</Link>
          </Button>
        ) : (
          <Button variant="secondary" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            Comprar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
