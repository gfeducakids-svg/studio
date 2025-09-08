
'use client';

import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, applyPendingPurchases } from '@/lib/firebase';
import { useToast } from './use-toast';

// Tipos base (ajuste o import/local conforme seu projeto)
export type SubmoduleStatus = 'unlocked' | 'active' | 'locked' | 'completed'
export type SubmoduleProgress = { status: SubmoduleStatus }
export type ModuleProgress = { status: SubmoduleStatus; submodules: { [k: string]: SubmoduleProgress } }
export type UserProgress = { [moduleId: string]: ModuleProgress }


interface UserData {
    name: string;
    email: string;
    progress?: UserProgress;
}

// Defina os submódulos com literal estreito e validados
const initialGrafismoFoneticoSubmodules = {
  intro: { status: 'unlocked' },
  'pre-alf': { status: 'unlocked' },
  alfabeto: { status: 'unlocked' },
  silabas: { status: 'unlocked' },
  fonico: { status: 'unlocked' },
  palavras: { status: 'unlocked' },
  escrita: { status: 'unlocked' },
  bonus: { status: 'unlocked' },
} as const satisfies Record<string, SubmoduleProgress>


export const getInitialProgress = (): UserProgress => ({
    'grafismo-fonetico': { status: 'locked', submodules: initialGrafismoFoneticoSubmodules },
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
});


export function useUserData() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    // Ref para garantir que a função seja chamada apenas uma vez por sessão
    const wasPurchaseCheckCalled = useRef(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Chama a Cloud Function para aplicar compras pendentes
                if (!wasPurchaseCheckCalled.current) {
                    wasPurchaseCheckCalled.current = true;
                    try {
                        console.log('Chamando applyPendingPurchases...');
                        const result = await applyPendingPurchases();
                        const data = result.data as { ok: boolean; applied: boolean; modules?: string[] };
                        
                        if (data.ok && data.applied) {
                            console.log(`Compras pendentes aplicadas para os módulos: ${data.modules?.join(', ')}`);
                            toast({
                                title: "Acesso Liberado!",
                                description: `Seu acesso aos novos módulos foi liberado com sucesso.`,
                            });
                        } else {
                             console.log('Nenhuma compra pendente encontrada para aplicar.');
                        }
                    } catch (error) {
                        console.error("Erro ao chamar applyPendingPurchases:", error);
                        // Opcional: notificar o usuário sobre o erro
                        // toast({
                        //     title: "Erro ao Sincronizar",
                        //     description: "Não foi possível verificar suas compras. O acesso será liberado em breve.",
                        //     variant: "destructive"
                        // });
                    }
                }

                const userDocRef = doc(db, 'users', user.uid);
                
                const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        setUserData(doc.data() as UserData);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Erro ao buscar dados do usuário:", error);
                    setUserData(null);
                    setLoading(false);
                });

                return () => unsubscribeSnapshot();
            } else {
                setUserData(null);
                setLoading(false);
                wasPurchaseCheckCalled.current = false; // Reseta para a próxima sessão de login
            }
        });

        return () => unsubscribeAuth();
    }, [toast]);

    return { userData, loading };
}
