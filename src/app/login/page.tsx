import Link from 'next/link';
import LoginForm from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 font-headline">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
        
        <div className="flex flex-col items-center gap-2">
            <Image 
                src="https://i.imgur.com/3vWDaKx.png"
                alt="EducaKids Logo"
                width={80}
                height={80}
                data-ai-hint="education logo"
            />
            <h2 className="text-4xl font-black text-foreground">EducaKids</h2>
        </div>

        <Card className="shadow-2xl rounded-2xl w-full">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-black text-foreground">Área de Membros</CardTitle>
            <CardDescription className="!mt-2 text-muted-foreground">Para os melhores pais do mundo</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
           <CardFooter className="flex-col gap-4 pt-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Crie uma aqui
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
