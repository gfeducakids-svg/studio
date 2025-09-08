
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

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

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
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
            }
        });

        return () => unsubscribeAuth();
    }, []);

    return { userData, loading };
}
