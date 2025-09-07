
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
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';


const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});

// Estrutura de progresso inicial para um novo usuário
const initialProgress = {
    'grafismo-fonetico': {
        status: 'locked',
        submodules: {
            'intro': { status: 'locked' },
            'pre-alf': { status: 'locked' },
            'alfabeto': { status: 'locked' },
            'silabas': { status: 'locked' },
            'fonico': { status: 'locked' },
            'palavras': { status: 'locked' },
            'escrita': { status: 'locked' },
            'bonus': { status: 'locked' },
        }
    },
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
};


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

  // Função para verificar e aplicar compras pendentes
  async function applyPendingPurchases(userId: string, userEmail: string) {
    const pendingDocRef = doc(db, "pending_purchases", userEmail.toLowerCase());
    const pendingDoc = await getDoc(pendingDocRef);

    if (pendingDoc.exists()) {
      const pendingData = pendingDoc.data();
      const modulesToUnlock: string[] = pendingData.modules || [];
      const userDocRef = doc(db, "users", userId);
      
      const updates: { [key: string]: any } = {};
      modulesToUnlock.forEach(moduleId => {
        updates[`progress.${moduleId}.status`] = 'active';
         // Caso especial para o módulo principal, desbloqueia também o primeiro submódulo.
        if (moduleId === 'grafismo-fonetico') {
            updates[`progress.grafismo-fonetico.submodules.intro.status`] = 'active';
        }
      });

      if (Object.keys(updates).length > 0) {
        await updateDoc(userDocRef, updates);
        console.log(`Módulos pendentes ${modulesToUnlock.join(', ')} aplicados ao usuário ${userId}.`);
      }
      
      // Remove o documento de compras pendentes após a aplicação
      await deleteDoc(pendingDocRef);
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const normalizedEmail = values.email.toLowerCase();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, values.password);
      const user = userCredential.user;

      // Cria o documento do usuário com a estrutura de progresso inicial.
      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        email: normalizedEmail,
        progress: initialProgress 
      });

      // Verifica e aplica quaisquer compras pendentes feitas antes do cadastro.
      await applyPendingPurchases(user.uid, normalizedEmail);

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
