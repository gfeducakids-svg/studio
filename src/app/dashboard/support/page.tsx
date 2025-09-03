'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

export default function SupportPage() {
  const { toast } = useToast();
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
        title: "Ticket de Suporte Enviado",
        description: "Obrigado por entrar em contato. Responderemos em breve.",
    });

    setSubject('');
    setMessage('');
    setIsSubmitting(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Central de Suporte</h1>
      <p className="text-muted-foreground mb-8">
        Precisa de ajuda? Envie sua dúvida e nossa equipe responderá o mais rápido possível.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Abrir um Ticket de Suporte</CardTitle>
          <CardDescription>
            Descreva seu problema ou dúvida em detalhes para que possamos te ajudar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              placeholder="Assunto" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea 
              placeholder="Descreva sua dúvida ou problema aqui..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
            />
            <Button type="submit" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
