'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
    name: string;
    email: string;
    modules: string[];
}

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
                    } else {
                        // Documento ainda não existe, pode estar sendo criado
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
                // Usuário não está logado
                setUserData(null);
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    return { userData, loading };
}
