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
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast({
        title: "Ops! Algo deu errado.",
        description: "E-mail ou senha incorretos. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePasswordReset = async () => {
    const email = form.getValues("email");
    if (!email || !z.string().email().safeParse(email).success) {
      form.setError("email", {
        type: "manual",
        message: "Por favor, insira um e-mail válido para redefinir a senha."
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "E-mail de redefinição enviado!",
        description: "Verifique sua caixa de entrada para criar uma nova senha.",
      });
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o e-mail. Verifique se o e-mail está correto e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <FormLabel className="text-muted-foreground">Sua senha secreta</FormLabel>
                <button type="button" onClick={handlePasswordReset} className="text-sm text-primary hover:underline focus:outline-none">
                  Esqueceu a senha?
                </button>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} className="py-6 rounded-lg"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-400 text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full py-6" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar na Trilha'}
        </Button>
      </form>
    </Form>
  );
}
