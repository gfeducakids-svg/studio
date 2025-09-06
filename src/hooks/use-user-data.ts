
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { getCourseStructure } from '@/lib/course-data';

interface SubmoduleProgress {
    status: 'locked' | 'active' | 'completed';
}

interface ModuleProgress {
    status: 'locked' | 'active' | 'completed';
    submodules: {
        [key: string]: SubmoduleProgress;
    };
}

interface UserProgress {
    [key: string]: ModuleProgress;
}

interface UserData {
    name: string;
    email: string;
    modules: string[];
    progress?: UserProgress;
}

const initialGrafismoFoneticoProgress: ModuleProgress = {
    status: 'locked', 
    submodules: {
        'intro': { status: 'locked' },
        'pre-alf': { status: 'locked' },
        'alfabeto': { status: 'locked' },
        'silabas': { status: 'locked' },
        'fonico': { status: 'locked' },
        'palavras': { status: 'locked' },
        'escrita': { status: 'locked' },
        'bonus': { status: 'locked' },
    }
};

const initialProgress: UserProgress = {
    'grafismo-fonetico': initialGrafismoFoneticoProgress,
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
};

async function initializeUserProgress(user: User) {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        
        let updates: { [key: string]: any } = {};
        let needsUpdate = false;

        if (!userData.progress) {
            // Se não houver progresso, inicializa tudo
            updates['progress'] = initialProgress;
            needsUpdate = true;
        } else {
            // Verifica cada módulo e o inicializa se não existir
            Object.keys(initialProgress).forEach(moduleId => {
                if (!userData.progress?.[moduleId]) {
                    updates[`progress.${moduleId}`] = initialProgress[moduleId as keyof typeof initialProgress];
                    needsUpdate = true;
                }
            });
             // Garante que todos os submódulos do grafismo fonético existam
            const grafismoSubmodules = initialProgress['grafismo-fonetico'].submodules;
            Object.keys(grafismoSubmodules).forEach(submoduleId => {
                 if (!userData.progress?.['grafismo-fonetico']?.submodules?.[submoduleId]) {
                    updates[`progress.grafismo-fonetico.submodules.${submoduleId}`] = grafismoSubmodules[submoduleId as keyof typeof grafismoSubmodules];
                    needsUpdate = true;
                }
            });
        }
        
        // Lógica de ativação do primeiro submódulo se o curso principal for liberado
        const grafismoProgress = userData.progress?.['grafismo-fonetico'];
        if (grafismoProgress && grafismoProgress.status !== 'locked') {
            const submodules = grafismoProgress.submodules;
            const firstLockedSubmodule = Object.keys(initialGrafismoFoneticoProgress.submodules).find(
                key => submodules[key]?.status === 'locked'
            );

            // Se existe um submódulo bloqueado e o curso está ativo, ativa o primeiro da lista de bloqueados.
            if (firstLockedSubmodule && submodules[firstLockedSubmodule].status === 'locked') {
                 updates[`progress.grafismo-fonetico.submodules.${firstLockedSubmodule}.status`] = 'active';
                 needsUpdate = true;
            }
        }


        if (needsUpdate) {
            await setDoc(userDocRef, updates, { merge: true });
        }

    }
}


export function useUserData() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Roda a verificação e possível inicialização de progresso
                initializeUserProgress(user);

                const userDocRef = doc(db, 'users', user.uid);
                const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        setUserData(doc.data() as UserData);
                    } else {
                        setUserData(null);
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
