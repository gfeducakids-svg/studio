
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreVertical, Star } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    step: 1,
    title: 'Abra no Chrome',
    description: (
        <a href="https://areademembroseducakids.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
            Acesse nosso site pelo navegador Google Chrome no seu celular ou tablet.
        </a>
    ),
    icon: <div className="bg-blue-500 rounded-full p-3 text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" /></svg></div>
  },
  {
    step: 2,
    title: 'Toque nos 3 Pontinhos',
    description: 'No canto superior direito, toque no ícone de menu (três pontinhos na vertical).',
    icon: <div className="bg-gray-200 rounded-lg p-3 text-gray-800"><MoreVertical className="h-6 w-6"/></div>
  },
  {
    step: 3,
    title: 'Instalar aplicativo',
    description: 'Procure e selecione a opção "Instalar aplicativo" ou "Adicionar à tela inicial".',
    icon: <div className="bg-gray-200 rounded-lg p-3 text-gray-800"><Star className="h-6 w-6"/></div>
  },
  {
    step: 4,
    title: 'Confirme',
    description: 'Uma janela aparecerá. Toque em "Instalar". Pronto! O app aparecerá na sua lista de aplicativos.',
  },
];


export default function AndroidInstallPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4 font-headline">
       <Card className="w-full max-w-lg shadow-2xl rounded-2xl">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl font-black text-foreground">Como Instalar no Android</CardTitle>
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
                <Link href="/login">
                Voltar para o Login
                </Link>
            </Button>
         </CardFooter>
        </Card>
    </main>
  );
}
