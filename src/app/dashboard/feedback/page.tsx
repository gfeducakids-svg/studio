
'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import React, { useState, useEffect } from 'react';
import { useUserData } from '@/hooks/use-user-data';
import { auth, db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { submitFeedback } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

interface Feedback {
    id: string;
    userName: string;
    userAvatar: string;
    text: string;
    createdAt: Timestamp;
}

const FeedbackSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-1/3" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
        </CardContent>
    </Card>
);

export default function FeedbackPage() {
  const { toast } = useToast();
  const { userData, loading: userLoading } = useUserData();
  const [feedback, setFeedback] = useState('');
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const feedbacks: Feedback[] = [];
      querySnapshot.forEach((doc) => {
        feedbacks.push({ id: doc.id, ...doc.data() } as Feedback);
      });
      setFeedbackList(feedbacks);
      setLoadingFeedback(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || !userData || !auth.currentUser) return;

    setIsSubmitting(true);
    
    try {
        await submitFeedback({
            text: feedback,
            userId: auth.currentUser.uid,
            userName: userData.name,
            userAvatar: 'https://picsum.photos/100/100' // Placeholder, idealmente viria do perfil
        });
        
        toast({
            title: "Comentário Enviado",
            description: "Agradecemos a sua contribuição! Você nos ajuda a melhorar.",
        });
        setFeedback('');

    } catch (error) {
         toast({
            title: "Erro ao Enviar",
            description: "Não foi possível salvar seu comentário. Tente novamente.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3 animate-in">
        <div className="md:col-span-1">
             <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline mb-2">Hub de Comentários</h1>
                <p className="text-muted-foreground">
                    Tem uma sugestão ou encontrou um problema? Deixe-nos saber. Lemos todos os comentários.
                </p>
            </div>
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
                          className="rounded-lg"
                          disabled={isSubmitting || userLoading}
                        />
                        <Button type="submit" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 rounded-full" disabled={isSubmitting || userLoading}>
                          {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold font-headline">Comentários Recentes</h2>
                {loadingFeedback ? (
                    <div className="space-y-4">
                        <FeedbackSkeleton />
                        <FeedbackSkeleton />
                    </div>
                ) : feedbackList.length > 0 ? (
                    feedbackList.map((item, index) => (
                        <Card key={item.id} className="animate-in" style={{ animationDelay: `${index * 100}ms`}}>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                <Avatar>
                                    <AvatarImage src={item.userAvatar} data-ai-hint="person avatar" />
                                    <AvatarFallback>{item.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-base font-semibold">{item.userName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{item.text}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted-foreground text-center py-8">Ainda não há comentários. Seja o primeiro!</p>
                )}
            </div>
        </div>
    </div>
  );
}
