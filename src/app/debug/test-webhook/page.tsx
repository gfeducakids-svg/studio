
// Use o cliente para interatividade, mas a lógica pesada está na server action
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { simulateWebhook } from "./actions";


// --- Componente do Cliente (UI) ---
export default function TestWebhookPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        
        try {
            const result = await simulateWebhook(formData);

            if (result.success) {
                toast({
                    title: "Simulação Concluída",
                    description: result.message,
                    variant: "default",
                });
            } else {
                toast({
                    title: "Erro na Simulação",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
             toast({
                title: "Erro Inesperado",
                description: "Ocorreu um erro ao processar a simulação.",
                variant: "destructive",
            });
        }


        setIsLoading(false);
    };

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Página de Teste de Webhook</CardTitle>
                    <CardDescription>
                        Simule uma compra da Kiwify para testar a liberação de módulos para usuários.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email do Cliente</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="cliente.teste@email.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Cliente</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Nome Sobrenome"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="moduleId">Produto (Módulo)</Label>
                            <Select name="moduleId" defaultValue="grafismo-fonetico" required>
                                <SelectTrigger id="moduleId">
                                    <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="grafismo-fonetico">Grafismo Fonético</SelectItem>
                                    <SelectItem value="desafio-21-dias">Desafio 21 Dias de Pronúncia</SelectItem>
                                    <SelectItem value="historias-curtas">Histórias Curtas</SelectItem>
                                    <SelectItem value="checklist-alfabetizacao">Checklist de Alfabetização</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                            {isLoading ? "Processando..." : "Simular Compra"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
