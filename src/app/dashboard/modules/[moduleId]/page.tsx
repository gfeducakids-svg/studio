// This is a catch-all page for module details.
// For this task, we are creating a specific page for 'grafismo-fonetico'
// but this structure could be used for other modules as well.
import { redirect } from 'next/navigation';

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  if (params.moduleId === 'grafismo-fonetico') {
    redirect('/dashboard/modules/grafismo-fonetico');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Módulo: {params.moduleId}</h1>
      <p className="text-muted-foreground">Conteúdo do módulo em construção.</p>
    </div>
  );
}
