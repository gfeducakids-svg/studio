
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
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
};

async function initializeUserProgress(user: User) {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        if (!userData.progress) {
             // Use setDoc with merge:true to avoid overwriting other fields
            await setDoc(userDocRef, { progress: initialProgress }, { merge: true });
        } else {
            // This is a failsafe to ensure the first module is active if somehow it's not.
            const grafismoProgress = userData.progress['grafismo-fonetico'];
            const allSubmodulesLocked = Object.values(grafismoProgress.submodules).every(s => s.status === 'locked');
            if (grafismoProgress.status === 'locked' && allSubmodulesLocked) {
                await updateDoc(userDocRef, {
                    'progress.grafismo-fonetico.status': 'active',
                    'progress.grafismo-fonetico.submodules.intro.status': 'active'
                });
            }
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
