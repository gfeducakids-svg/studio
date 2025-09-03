
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
    status: 'active', // O módulo principal começa ativo
    submodules: {
        'intro': { status: 'active' },
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
    'desafio-21-dias': { status: 'active', submodules: {} },
    'checklist-alfabetizacao': { status: 'active', submodules: {} },
    'historias-curtas': { status: 'active', submodules: {} },
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
            // Verifica cada módulo secundário e o inicializa se não existir
            Object.keys(initialProgress).forEach(moduleId => {
                if (!userData.progress?.[moduleId]) {
                    updates[`progress.${moduleId}`] = initialProgress[moduleId];
                    needsUpdate = true;
                }
            });
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
                // Initialize progress if it doesn't exist
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
