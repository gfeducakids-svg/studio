
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
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const normalizedEmail = values.email.toLowerCase();

    try {
      // 1. Verifica se há compras pendentes ANTES de criar o usuário
      const pendingDocRef = doc(db, "pending_purchases", normalizedEmail);
      const pendingDoc = await getDoc(pendingDocRef);
      
      const progressData = getInitialProgress();

      if (pendingDoc.exists()) {
        const pendingData = pendingDoc.data();
        const modulesToUnlock: string[] = pendingData.modules || [];
        
        // 2. Modifica o objeto de progresso inicial na memória
        modulesToUnlock.forEach(moduleId => {
          if (progressData[moduleId as keyof typeof progressData]) {
            progressData[moduleId as keyof typeof progressData].status = 'unlocked';
            // Caso especial para o módulo principal
            if (moduleId === 'grafismo-fonetico' && progressData[moduleId].submodules.intro) {
              progressData[moduleId].submodules.intro.status = 'unlocked';
            }
          }
        });
      }

      // 3. Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, values.password);
      const user = userCredential.user;

      // 4. Cria o documento do usuário no Firestore com o progresso JÁ CORRETO
      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: normalizedEmail,
        progress: progressData // Usa o objeto de progresso modificado
      });
      
      // 5. Se havia uma compra pendente, remove o documento
      if (pendingDoc.exists()) {
        await deleteDoc(pendingDocRef);
        console.log(`Módulos pendentes aplicados e registro removido para ${normalizedEmail}.`);
      }

      router.push('/dashboard');
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
