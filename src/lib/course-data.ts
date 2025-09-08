
// This file would ideally fetch data from a database like Firestore
// For now, it returns static data to simulate that.

import type { UserProgress, SubmoduleProgress } from "@/hooks/use-user-data";

// Mocks the structure we'd expect from Firestore
interface Material {
    id: number;
    type: 'video' | 'pdf' | 'link' | 'download' | 'atividade';
    title: string;
}

interface Submodule {
    id: string;
    title: string;
    pdfUrl: string;
    materials: Material[];
}

interface Course {
    id: string;
    title: string;
    submodules: Submodule[];
}

// Defina os submódulos com o status inicial correto.
// Todos os submódulos do curso principal são desbloqueados por padrão.
const initialGrafismoFoneticoSubmodules: Record<string, SubmoduleProgress> = {
  intro: { status: 'unlocked' },
  'pre-alf': { status: 'unlocked' },
  alfabeto: { status: 'unlocked' },
  silabas: { status: 'unlocked' },
  fonico: { status: 'unlocked' },
  palavras: { status: 'unlocked' },
  escrita: { status: 'unlocked' },
  bonus: { status: 'unlocked' },
};


export const getInitialProgress = (): UserProgress => ({
    'grafismo-fonetico': { status: 'unlocked', submodules: initialGrafismoFoneticoSubmodules },
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
});


const grafismoFoneticoData: Course = {
    id: 'grafismo-fonetico',
    title: 'Método de Grafismo Fonético',
    submodules: [
        { id: 'intro', title: 'Introdução', pdfUrl: 'https://drive.google.com/file/d/1Yd3KNRMeznq8vWzCSBWrnvWyYXONo5JK/preview', materials: [{ id: 1, type: 'video', title: 'Boas-vindas'}] },
        { id: 'pre-alf', title: 'Módulo 01', pdfUrl: 'https://drive.google.com/file/d/10id_hmbKbH0yqi623ylopyjR2cOeWI1D/preview', materials: [{ id: 1, type: 'video', title: 'Aula 1'}, {id: 2, type: 'pdf', title: 'Exercício de Traços'}] },
        { id: 'alfabeto', title: 'Módulo 02', pdfUrl: 'https://drive.google.com/file/d/1Uxs4yPT9NuDHMRkAMfL85ZnCHZU-NbNQ/preview', materials: [{ id: 1, type: 'video', title: 'As Vogais'}, {id: 2, type: 'pdf', title: 'Cartilha do Alfabeto'}, {id: 3, type: 'download', title: 'Áudios das Letras'}] },
        { id: 'silabas', title: 'Módulo 03', pdfUrl: 'https://drive.google.com/file/d/1k-s5EoRwlWloBICD7uWV-PbMsJNA27GB/preview', materials: [{ id: 1, type: 'video', title: 'BA-BE-BI-BO-BU'}, {id: 2, type: 'pdf', title: 'Tabela de Sílabas'}] },
        { id: 'fonico', title: 'Módulo 04', pdfUrl: 'https://drive.google.com/file/d/1jYvC01jsIArCRVa8Tc78JA7V8wbslkbT/preview', materials: [] },
        { id: 'palavras', title: 'Módulo 05', pdfUrl: 'https://drive.google.com/file/d/1fUa0seaOrUeyRu-uHk4hTCMDXiMcl5kq/preview', materials: [] },
        { id: 'escrita', title: 'Módulo 06', pdfUrl: 'https://drive.google.com/file/d/1-SnD4rkpr-6RMj_l-S-m1x1GAIhjAyCb/preview', materials: [] },
        { id: 'bonus', title: 'Bônus', pdfUrl: 'https://drive.google.com/file/d/1NbCn_smFEi98h-gYKtBwNftmoIXVebJ5/preview', materials: [] },
    ],
};

// In a real app, this would be an async function that fetches from Firestore
// e.g., `getDoc(doc(db, 'courses', courseId))`
export const getCourseStructure = async (courseId: string): Promise<Course> => {
    // Simulate async fetch
    await new Promise(resolve => setTimeout(resolve, 50)); 
    
    if (courseId === 'grafismo-fonetico') {
        return grafismoFoneticoData;
    }
    
    // Fallback for other courses or if not found
    throw new Error(`Course with id ${courseId} not found.`);
};

