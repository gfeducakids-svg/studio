// This is a catch-all page for module details.
// It handles specific pages like 'grafismo-fonetico' and provides a default
// tabbed layout for other modules.
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Paperclip, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Helper function to format the module ID into a nice title
function formatModuleId(id: string) {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  // Redirect to the specific page if it exists
  if (params.moduleId === 'grafismo-fonetico') {
    redirect('/dashboard/modules/grafismo-fonetico');
  }

  const moduleTitle = formatModuleId(params.moduleId);

  // Default layout for other modules
  return (
    <div className="flex flex-col gap-8 animate-in">
        <Card>
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
                <CardDescription>Conteúdo do módulo em preparação.</CardDescription>
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
        </Card>
    </div>
  );
}
