
"use client";

import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import React from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getInitialProgress } from '@/hooks/use-user-data';


const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});

export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Este formulário agora tem uma única responsabilidade: criar o usuário
  // com o progresso inicial padrão. A lógica de aplicar compras pendentes
  // foi movida para o formulário de login para ser mais robusta.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const normalizedEmail = values.email.toLowerCase();

    try {
      // 1. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, values.password);
      const user = userCredential.user;

      // 2. Cria o documento do usuário no Firestore com o progresso inicial.
      // A função getInitialProgress() já define os submódulos do grafismo como "unlocked".
      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: normalizedEmail,
        progress: getInitialProgress(),
      });
      console.log(`Documento do usuário ${user.uid} criado no Firestore com progresso inicial.`);
      
      // 3. Redireciona para a página de LOGIN com mensagem de sucesso
      toast({
        title: "Conta criada com sucesso!",
        description: "Agora você pode fazer o login para começar sua jornada.",
      });
      router.push('/login');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        form.setError("email", {
            type: "manual",
            message: "Este e-mail já está em uso. Tente fazer login.",
        });
      } else {
        console.error("Erro no cadastro:", error);
        toast({
            title: "Erro no cadastro",
            description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
            variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Seu nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome do Aventureiro" {...field} className="py-6 rounded-lg"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Seu melhor e-mail</FormLabel>
              <FormControl>
                <Input placeholder="seunome@email.com" {...field} className="py-6 rounded-lg"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Crie uma senha secreta</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} className="py-6 rounded-lg"/>
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
              <FormLabel className="text-muted-foreground">Confirme a senha secreta</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} className="py-6 rounded-lg"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-400 text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full py-6" disabled={isLoading}>
          {isLoading ? 'Criando...' : 'Criar Conta e Iniciar'}
        </Button>
      </form>
    </Form>
  );
}
