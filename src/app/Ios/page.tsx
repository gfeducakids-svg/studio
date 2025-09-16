
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, SquarePlus } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    step: 1,
    title: 'Abra o Safari',
    description: 'Acesse nosso site pelo navegador Safari no seu iPhone ou iPad.',
    icon: <div className="bg-blue-500 rounded-lg p-3 text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12C4 8.68629 6.68629 6 10 6C13.3137 6 16 8.68629 16 12C16 15.3137 13.3137 18 10 18C6.68629 18 4 15.3137 4 12Z" /><path d="M10 12L18 12" /><path d="M14 8L20 14" /></svg></div>
  },
  {
    step: 2,
    title: 'Toque em "Compartilhar"',
    description: 'Na parte inferior da tela, toque no ícone de compartilhamento (um quadrado com uma seta para cima).',
    icon: <div className="bg-gray-200 rounded-lg p-3 text-gray-800"><Share2 className="h-6 w-6"/></div>
  },
  {
    step: 3,
    title: 'Adicionar à Tela de Início',
    description: 'Role para baixo e selecione a opção "Adicionar à Tela de Início".',
    icon: <div className="bg-gray-200 rounded-lg p-3 text-gray-800"><SquarePlus className="h-6 w-6"/></div>
  },
  {
    step: 4,
    title: 'Confirme',
    description: 'Toque em "Adicionar" no canto superior direito. Pronto! O ícone do nosso app aparecerá na sua tela.',
  },
];


export default function IosInstallPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4 font-headline">
       <Card className="w-full max-w-lg shadow-2xl rounded-2xl">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl font-black text-foreground">Como Instalar no iPhone / iPad</CardTitle>
            <CardDescription className="!mt-2 text-muted-foreground">Siga os passos abaixo para ter o app sempre à mão!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {steps.map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  {item.step < steps.length && <div className="w-px h-8 bg-border mt-2"></div>}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
                {item.icon && <div className="ml-auto">{item.icon}</div>}
              </div>
            ))}
          </CardContent>
            <CardFooter className="pt-6">
                <Button asChild size="lg" className="w-full font-bold">
                    <Link href="/register">
                    Eu Entendi! Agora quero criar minha conta
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    </main>
  );
}
