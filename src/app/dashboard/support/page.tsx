'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import { chatWithSupport, ChatWithSupportOutput } from '@/ai/flows/support-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export default function SupportPage() {
    const { toast } = useToast();
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<Message[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMessage: Message = { sender: 'user', text: message };
        setHistory(prev => [...prev, userMessage]);
        setIsSubmitting(true);
        setMessage('');

        try {
            const response: ChatWithSupportOutput = await chatWithSupport({ userQuestion: message });
            const aiMessage: Message = { sender: 'ai', text: response.answer };
            setHistory(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Erro ao chamar a IA:", error);
            toast({
                title: "Ops! A IA está tirando uma soneca.",
                description: "Não foi possível obter uma resposta. Tente novamente mais tarde.",
                variant: "destructive",
            });
            // Remove a mensagem do usuário se a IA falhar
            setHistory(prev => prev.slice(0, prev.length -1));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline mb-2">Central de Ajuda da IA</h1>
                <p className="text-muted-foreground">
                    Tem alguma dúvida? Nosso assistente virtual está pronto para ajudar!
                </p>
            </div>
            
            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Converse com nosso Assistente</CardTitle>
                    <CardDescription>Pergunte sobre os módulos, exercícios ou o método.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <ScrollArea className="flex-1 pr-4">
                       <div className="space-y-6">
                         {history.map((msg, index) => (
                             <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                 {msg.sender === 'ai' && (
                                     <Avatar className="w-8 h-8 border-2 border-primary">
                                         <AvatarFallback><Bot size={20} /></AvatarFallback>
                                     </Avatar>
                                 )}
                                 <div className={`rounded-lg px-4 py-3 max-w-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                     <p className="text-sm">{msg.text}</p>
                                 </div>
                                 {msg.sender === 'user' && (
                                     <Avatar className="w-8 h-8 border-2 border-muted-foreground">
                                         <AvatarFallback><User size={20} /></AvatarFallback>
                                     </Avatar>
                                 )}
                             </div>
                         ))}
                         {isSubmitting && (
                            <div className="flex items-start gap-3">
                                 <Avatar className="w-8 h-8 border-2 border-primary">
                                     <AvatarFallback><Bot size={20} /></AvatarFallback>
                                 </Avatar>
                                 <div className="rounded-lg px-4 py-3 bg-muted animate-pulse">
                                     <p className="text-sm text-transparent">Digitando...</p>
                                 </div>
                            </div>
                         )}
                       </div>
                    </ScrollArea>
                    <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t">
                        <Input
                            placeholder="Escreva sua pergunta aqui..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isSubmitting}
                            autoFocus
                        />
                        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
