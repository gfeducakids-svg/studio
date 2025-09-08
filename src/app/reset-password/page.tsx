
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const passwordSchema = z.object({
  password: z.string().min(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

function ResetPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const [verificationState, setVerificationState] = useState<'verifying' | 'valid' | 'invalid'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setVerificationState('invalid');
        setError('Nenhum código de redefinição fornecido. Por favor, tente novamente a partir do link em seu e-mail.');
        return;
      }
      try {
        await verifyPasswordResetCode(auth, oobCode);
        setVerificationState('valid');
      } catch (err) {
        setVerificationState('invalid');
        setError('O link de redefinição de senha é inválido ou já expirou. Por favor, solicite um novo.');
        console.error('Verify password reset code error:', err);
      }
    };
    verifyCode();
  }, [oobCode]);

  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    if (verificationState !== 'valid' || !oobCode) return;
    
    setIsSubmitting(true);
    setError(null);
    try {
      await confirmPasswordReset(auth, oobCode, data.password);
      setSuccess(true);
    } catch (err) {
      setError('Ocorreu um erro ao redefinir sua senha. O link pode ter expirado. Por favor, tente novamente.');
      console.error('Confirm password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationState === 'verifying') {
    return (
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    );
  }

  if (success) {
    return (
        <Card className="w-full max-w-md shadow-2xl text-center">
            <CardHeader>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <CardTitle className="text-2xl font-bold">Senha Alterada!</CardTitle>
                <CardDescription>Sua senha foi atualizada com sucesso.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="/login">Ir para a tela de Login</Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  if (verificationState === 'invalid') {
     return (
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                <CardTitle className="text-2xl font-bold">Link Inválido</CardTitle>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
                 <Button asChild className="w-full mt-6">
                    <Link href="/login">Voltar para o Login</Link>
                </Button>
            </CardContent>
        </Card>
     );
  }


  return (
    <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Definir Nova Senha</CardTitle>
            <CardDescription className="text-center">Escolha uma nova senha para sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="password">Nova Senha</Label>
                                <FormControl>
                                    <Input id="password" type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                <FormControl>
                                    <Input id="confirmPassword" type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {error && (
                        <p role="alert" className="text-sm font-medium text-destructive">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}


export default function ResetPasswordPage() {
    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
            <Suspense fallback={<div>Carregando...</div>}>
                <ResetPasswordComponent />
            </Suspense>
        </main>
    );
}

