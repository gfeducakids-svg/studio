import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  isUnlocked: boolean;
}

export default function ModuleCard({ id, title, description, icon: Icon, isUnlocked }: ModuleCardProps) {
  const CardWrapper = isUnlocked ? Link : 'div';

  return (
    <CardWrapper href={isUnlocked ? `/dashboard/modules/${id}` : undefined}>
      <Card className={cn(
        "flex flex-col h-full transition-all group",
        isUnlocked ? 'cursor-pointer hover:shadow-lg hover:scale-105 hover:border-primary' : 'cursor-default'
      )}>
        <CardHeader className="p-0 relative h-40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-300/20 rounded-t-lg flex items-center justify-center overflow-hidden">
             <Icon className="h-16 w-16 text-primary/50" />
             {!isUnlocked && (
                <>
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>
                  <Lock className="h-12 w-12 text-muted-foreground z-10"/>
                </>
             )}
          </div>
        </CardHeader>
        <div className="flex flex-col flex-grow p-4">
          <CardTitle className="font-headline text-lg leading-tight flex-grow">{title}</CardTitle>
          <CardDescription className="mt-2 text-xs">{description}</CardDescription>
        </div>
        <CardFooter className="p-4 pt-0">
          <Button 
            asChild={isUnlocked}
            variant={isUnlocked ? 'default' : 'secondary'} 
            className={cn("w-full", !isUnlocked && "bg-accent text-accent-foreground hover:bg-accent/90")}
            onClick={(e) => {
              if (!isUnlocked) {
                e.preventDefault();
                // Aqui você pode adicionar a lógica para o botão "Comprar",
                // como abrir um modal ou redirecionar para uma página de vendas.
                console.log("Ação de compra para o módulo:", id);
              }
            }}
          >
            {isUnlocked ? <p>Acessar Conteúdo</p> : <p>Comprar</p>}
          </Button>
        </CardFooter>
      </Card>
    </CardWrapper>
  );
}