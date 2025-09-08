
'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import React, {useState} from 'react';

export default function DiagnosticsPage() {
  const {toast} = useToast();
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [healthResult, setHealthResult] = useState<object | null>(null);
  const [sendResult, setSendResult] = useState<object | null>(null);
  const [email, setEmail] = useState('');

  const runHealthCheck = async () => {
    setIsLoadingHealth(true);
    setHealthResult(null);
    try {
      const res = await fetch('/api/_health');
      const data = await res.json();
      setHealthResult(data);
      toast({title: 'Diagnóstico Concluído'});
    } catch (error) {
      setHealthResult({error: 'Falha ao buscar a API de health check.'});
      toast({title: 'Erro no Diagnóstico', variant: 'destructive'});
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoadingSend(true);
    setSendResult(null);
    try {
      const res = await fetch('/api/auth/send-reset', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });
      const data = await res.json();
      setSendResult(data);
      if (res.ok) {
        toast({title: 'E-mail de teste enviado com sucesso!'});
      } else {
        toast({
          title: 'Falha ao enviar e-mail de teste',
          description: data.error?.message || 'Erro desconhecido.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      setSendResult({error: 'Falha ao chamar a API de envio.'});
      toast({
        title: 'Erro na API',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingSend(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-muted/40 p-4 sm:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Página de Diagnóstico</h1>
          <p className="text-muted-foreground">Ferramentas para verificar a saúde do sistema de envio de e-mails.</p>
        </div>

        {/* Health Check Card */}
        <Card>
          <CardHeader>
            <CardTitle>Health Check do Sistema</CardTitle>
            <CardDescription>
              Verifica variáveis de ambiente, conexão SMTP e a configuração do Firebase Admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runHealthCheck} disabled={isLoadingHealth}>
              {isLoadingHealth ? 'Verificando...' : 'Rodar Diagnóstico'}
            </Button>
            {healthResult && (
              <pre className="mt-4 w-full overflow-x-auto rounded-md bg-slate-950 p-4 text-white">
                {JSON.stringify(healthResult, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* Send Test Email Card */}
        <Card>
          <CardHeader>
            <CardTitle>Teste de Envio de E-mail</CardTitle>
            <CardDescription>
              Dispara a rota `/api/auth/send-reset` com um e-mail específico para testar o fluxo completo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail de Destino</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="usuario.teste@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoadingSend}>
                {isLoadingSend ? 'Enviando...' : 'Enviar E-mail de Teste'}
              </Button>
            </form>
            {sendResult && (
              <pre className="mt-4 w-full overflow-x-auto rounded-md bg-slate-950 p-4 text-white">
                {JSON.stringify(sendResult, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
