import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full bg-background font-headline">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16 lg:flex-row lg:justify-between">
        
        {/* Seção de Texto */}
        <div className="flex flex-col gap-6 text-center lg:text-left lg:w-1/2">
          <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight">
            Grafismo Fonético
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            O método que mais alfabetiza crianças. Uma jornada de aprendizado divertida e eficaz que começa com um simples traço.
          </p>
          <ul className="space-y-3 text-left self-center lg:self-start">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="font-semibold">Resultados comprovados</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="font-semibold">Atividades lúdicas e interativas</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="font-semibold">Aprovado por pais e pedagogos</span>
            </li>
          </ul>
          <div className="mt-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-blue-400 text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full px-10 py-6">
              <Link href="/login">Começar a Aventura</Link>
            </Button>
          </div>
        </div>

        {/* Seção da Ilustração */}
        <div className="relative flex items-center justify-center lg:w-1/2">
          <div className="absolute w-full h-full max-w-lg max-h-lg bg-primary/20 rounded-full blur-3xl"></div>
          <Image 
            src="https://i.imgur.com/fAyKoDU.jpeg"
            alt="Criança feliz aprendendo a ler"
            width={600}
            height={600}
            className="relative w-full max-w-md aspect-square rounded-2xl object-cover shadow-2xl"
            data-ai-hint="child learning"
          />
        </div>
        
      </div>
    </main>
  );
}
