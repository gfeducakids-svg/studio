
import { Button } from '@/components/ui/button';
import { Smartphone, Apple } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ObrigadoTutorialPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 p-4 font-body animate-in">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="h-2 w-full bg-primary"></div>
          <div className="p-8 text-center">
            
            <Image 
                src="https://i.imgur.com/3vWDaKx.png"
                alt="EducaKids Logo"
                width={60}
                height={60}
                data-ai-hint="education logo"
                className="mx-auto mb-4"
            />
            
            <h1 className="font-body text-4xl font-black text-blue-900">
              PARABÉNS!
            </h1>
            <p className="mt-2 text-base text-foreground/80 font-semibold">
              Você acabou de dar o presente mais valioso para o seu filho: o futuro dele! 🎉
            </p>

            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
                <p>
                Neste exato momento, você não apenas adquiriu o Método Chinês de Alfabetização - você investiu na autoestima, na confiança e no brilho nos olhos do seu pequeno quando ele descobrir que consegue ler sozinho. Milhares de famílias já viveram essa transformação mágica: crianças que antes fugiam dos livros agora pedem "mais uma história" antes de dormir.
                </p>
                <p>
                A partir de agora, você faz parte de uma comunidade exclusiva de pais visionários. Em poucos minutos, você receberá o acesso completo ao método em seu email. Prepare-se para se emocionar com os primeiros "mamãe, eu consegui ler!" do seu filho.
                </p>
                <p className="font-bold text-foreground">
                O futuro brilhante do seu pequeno começou hoje, e você foi o herói dessa história! 🌟
                </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-bold text-lg text-foreground">Instruções para você instalar o app:</h3>
                <p className="text-sm text-muted-foreground">Em qual dispositivo você quer instalar?</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button asChild size="lg" className="h-14 bg-gradient-to-br from-blue-900 to-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-transform">
                        <Link href="/Ios">
                            <Apple className="mr-2 h-5 w-5" />
                            <span>iPhone / iPad</span>
                        </Link>
                    </Button>
                    <Button asChild size="lg" className="h-14 bg-gradient-to-br from-blue-900 to-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-transform">
                        <Link href="/Android">
                            <Smartphone className="mr-2 h-5 w-5" />
                            <span>Android / Tablet</span>
                        </Link>
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
