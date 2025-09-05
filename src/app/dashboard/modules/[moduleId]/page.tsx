
'use client';

import { useState } from 'react';
import { redirect, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Paperclip, ArrowLeft, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/hooks/use-user-data';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to format the module ID into a nice title
function formatModuleId(id: string) {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ModulePage() {
  const params = useParams();
  const moduleId = Array.isArray(params.moduleId) ? params.moduleId[0] : params.moduleId;

  const { userData, loading: userLoading } = useUserData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to the specific page if it exists
  if (moduleId === 'grafismo-fonetico') {
    redirect('/dashboard/modules/grafismo-fonetico');
  }
   if (moduleId === 'checklist-alfabetizacao') {
    redirect('/dashboard/modules/checklist-alfabetizacao');
  }

  const moduleTitle = formatModuleId(moduleId);
  
  if (userLoading) {
      return (
          <div className="flex flex-col gap-8 animate-in">
              <Card className="overflow-hidden">
                  <CardHeader>
                      <Skeleton className="h-8 w-1/4 mb-4" />
                      <Skeleton className="h-10 w-1/2" />
                      <Skeleton className="h-5 w-3/4" />
                  </CardHeader>
                  <CardContent>
                      <Skeleton className="h-10 w-full mb-6" />
                      <Skeleton className="h-64 w-full" />
                  </CardContent>
                  <CardFooter>
                      <Skeleton className="h-12 w-48" />
                  </CardFooter>
              </Card>
          </div>
      );
  }

  const isCompleted = userData?.progress?.[moduleId]?.status === 'completed';

  const handleMarkAsCompleted = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        [`progress.${moduleId}.status`]: 'completed'
      });
      toast({
        title: (
            <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-400" />
                <span className="font-bold">Conquista Desbloqueada!</span>
            </div>
        ),
        description: `Você concluiu "${moduleTitle}"! Veja sua nova conquista na área de prêmios.`,
      });
    } catch (error) {
      console.error("Erro ao marcar como concluído:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar seu progresso. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex flex-col gap-8 animate-in">
        <Card className="overflow-hidden">
            <CardHeader>
                 <Button variant="ghost" className="self-start mb-4 -ml-4" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para os Cursos
                    </Link>
                </Button>
                <CardTitle className="text-2xl font-bold font-headline">
                    {moduleTitle}
                </CardTitle>
                <CardDescription>Explore o conteúdo do módulo abaixo.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="aula" className="relative">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="aula">Aula</TabsTrigger>
                        <TabsTrigger value="atividades">Atividades</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="aula" className="mt-6">
                        <div className="bg-muted rounded-lg w-full min-h-[50vh] flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                            <FileText size={48} className="mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Aula em Preparação</h3>
                            <p>O conteúdo principal para este módulo ainda não está disponível.</p>
                            <Button className="mt-4 font-bold" disabled>Acessar Conteúdo</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="atividades" className="mt-6">
                        <div className="col-span-full p-8 bg-muted rounded-lg flex flex-col items-center justify-center text-center min-h-[50vh]">
                            <Paperclip size={32} className="mb-4 text-muted-foreground"/>
                            <p className="text-muted-foreground font-semibold">Nenhuma atividade disponível.</p>
                            <p className="text-xs text-muted-foreground">Volte para a aba "Aula" para ver o conteúdo principal quando for liberado.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center">
                {isCompleted ? (
                    <Button
                        disabled={true}
                        size="lg"
                        className="font-bold text-lg shadow-lg rounded-full px-10 py-6 bg-green-500 hover:bg-green-500 cursor-not-allowed"
                    >
                        Concluído <Check className="ml-2 h-5 w-5"/>
                    </Button>
                ) : (
                    <Button 
                        onClick={handleMarkAsCompleted}
                        disabled={isSubmitting}
                        size="lg"
                        className="font-bold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full px-10 py-6"
                    >
                        {isSubmitting ? 'Salvando...' : "Marcar como concluído"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    </div>
  );
}
