'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserData } from '@/hooks/use-user-data';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { updateUserProfile } from './actions';
import { useState } from 'react';
import { auth } from '@/lib/firebase';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { userData, loading } = useUserData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: userData?.name || '',
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    const user = auth.currentUser;
    if (!user) {
        toast({
            title: "Erro de Autenticação",
            description: "Você precisa estar logado para atualizar seu perfil.",
            variant: "destructive"
        });
        return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await updateUserProfile({ uid: user.uid, newName: data.name });
      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: 'Seu nome foi atualizado.',
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao Atualizar',
        description: error.message || 'Não foi possível atualizar seu nome. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="animate-in">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Meu Perfil</h1>
            <p className="text-muted-foreground">Atualize suas informações pessoais.</p>
        </div>
        <Card className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Detalhes Pessoais</CardTitle>
                    <CardDescription>
                    Este nome será exibido em seu perfil e na plataforma.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome de Exibição</Label>
                        <Input id="name" {...register('name')} />
                        {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={userData?.email || ''} disabled />
                        <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
}
