
'use client';

import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
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

export function useUserData() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    // Ref para garantir que a função seja chamada apenas uma vez por sessão
    const wasPurchaseCheckCalled = useRef(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Chama a API para aplicar compras pendentes
                if (!wasPurchaseCheckCalled.current) {
                    wasPurchaseCheckCalled.current = true;
                    try {
                        console.log('Calling /api/apply-pending...');
                        const token = await user.getIdToken();
                        const response = await fetch("/api/apply-pending", {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}` },
                        });

                        if (!response.ok) {
                            throw new Error(`API responded with status ${response.status}`);
                        }
                        
                        const data = await response.json();
                        
                        if (data.ok && data.applied) {
                            console.log(`Pending purchases applied for modules: ${data.modules?.join(', ')}`);
                            toast({
                                title: "Acesso Liberado!",
                                description: `Seu acesso aos novos módulos foi liberado com sucesso.`,
                            });
                            // A atualização dos dados virá pelo onSnapshot, não é necessário refetch manual.
                        } else {
                             console.log('No pending purchases found to apply.');
                        }
                    } catch (error) {
                        console.error("Error calling /api/apply-pending:", error);
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
