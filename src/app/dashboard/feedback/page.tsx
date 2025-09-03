'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import React from 'react';

const recentFeedback = [
    {
        user: "Alice",
        avatar: "https://picsum.photos/101/101",
        feedback: "Os exercícios de tons são fantásticos! Realmente me ajudaram a distinguir entre o 2º e o 3º tom."
    },
    {
        user: "Bob",
        avatar: "https://picsum.photos/102/102",
        feedback: "Adoraria ver mais exemplos de 'ü' depois de j, q, x. É um pouco complicado."
    },
    {
        user: "Charlie",
        avatar: "https://picsum.photos/103/103",
        feedback: "A experiência no celular é super fluida. Obrigado por torná-la responsiva!"
    }
];

export default function FeedbackPage() {
  const { toast } = useToast();
  const [feedback, setFeedback] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
        title: "Comentário Enviado",
        description: "Agradecemos a sua contribuição! Você nos ajuda a melhorar.",
    });

    setFeedback('');
    setIsSubmitting(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <h1 className="text-3xl font-bold font-headline mb-2">Hub de Comentários</h1>
            <p className="text-muted-foreground">
                Tem uma sugestão ou encontrou um problema? Deixe-nos saber. Lemos todos os comentários.
            </p>
        </div>
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Envie seu Comentário</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea 
                          placeholder="Diga-nos o que você pensa..." 
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows={5}
                        />
                        <Button type="submit" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                          {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold font-headline">Comentários Recentes</h2>
                {recentFeedback.map((item, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                            <Avatar>
                                <AvatarImage src={item.avatar} data-ai-hint="person avatar" />
                                <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-base font-semibold">{item.user}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{item.feedback}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </div>
  );
}
