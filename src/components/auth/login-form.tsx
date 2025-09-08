
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
import { signInWithEmailAndPassword } from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSendingReset, setIsSendingReset] = React.useState(false);
  const emailInputRef = React.useRef<HTMLInputElement>(null);

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
       if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
         toast({
            title: "Credenciais inválidas",
            description: "O e-mail ou a senha estão incorretos. Por favor, tente novamente.",
            variant: "destructive",
          });
          form.setValue("password", "");
          if (emailInputRef.current) {
            emailInputRef.current.focus();
            emailInputRef.current.select();
          }
       } else {
         console.error("Login error:", error);
         toast({
            title: "Ops! Algo deu errado.",
            description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
            variant: "destructive",
         });
       }
    } finally {
      setIsLoading(false);
    }
  }

  const handlePasswordReset = async () => {
    // Valida apenas o campo de e-mail
    const email = form.getValues("email");
    const emailValidation = z.string().email({ message: "Por favor, insira um e-mail válido para redefinir a senha." }).safeParse(email);

    if (!emailValidation.success) {
      form.setError("email", {
        type: "manual",
        message: emailValidation.error.errors[0].message
      });
      return;
    }
    
    setIsSendingReset(true);
    try {
        const response = await fetch('/api/auth/send-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailValidation.data }),
        });

        const result = await response.json();

        if (!response.ok) {
            // Se a API retornar um erro (como 404), lança um erro com a mensagem da API
            throw new Error(result.error || "Não foi possível enviar o e-mail.");
        }
      
      toast({
        title: "E-mail de redefinição enviado!",
        description: "Verifique sua caixa de entrada (e a pasta de spam) para criar uma nova senha.",
      });
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      toast({
        title: "Erro ao Enviar",
        description: error.message || "Não foi possível enviar o e-mail. Verifique se o e-mail está correto e tente novamente.",
        variant: "destructive",
      });
    } finally {
        setIsSendingReset(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 font-headline">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Seu melhor e-mail</FormLabel>
              <FormControl>
                <Input 
                    placeholder="seunome@email.com" 
                    {...field} 
                    ref={emailInputRef}
                    className="py-6 rounded-lg"
                />
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
                <button 
                    type="button" 
                    onClick={handlePasswordReset} 
                    className="text-sm text-primary hover:underline focus:outline-none disabled:opacity-50"
                    disabled={isSendingReset}
                >
                  {isSendingReset ? "Enviando..." : "Esqueceu a senha?"}
                </button>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} className="py-6 rounded-lg"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-400 text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-full py-6" disabled={isLoading || isSendingReset}>
          {isLoading ? 'Entrando...' : 'Entrar na Trilha'}
        </Button>
      </form>
    </Form>
  );
}
