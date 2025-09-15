
// This file would ideally fetch data from a database like Firestore
// For now, it returns static data to simulate that.

import type { UserProgress, SubmoduleProgress } from "@/hooks/use-user-data";

// Mocks the structure we'd expect from Firestore
interface Material {
    id: number;
    type: 'video' | 'pdf' | 'link' | 'download' | 'atividade';
    title: string;
    description: string;
    url?: string;
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

export const getInitialProgress = (): UserProgress => ({
    'grafismo-fonetico': { 
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
    },
    'desafio-21-dias': { status: 'locked', submodules: {} },
    'checklist-alfabetizacao': { status: 'locked', submodules: {} },
    'historias-curtas': { status: 'locked', submodules: {} },
});


const grafismoFoneticoData: Course = {
    id: 'grafismo-fonetico',
    title: 'Método de Grafismo Fonético',
    submodules: [
        { id: 'intro', title: 'Introdução', pdfUrl: 'https://drive.google.com/file/d/1Yd3KNRMeznq8vWzCSBWrnvWyYXONo5JK/preview', materials: [] },
        { id: 'pre-alf', title: 'Módulo 01', pdfUrl: 'https://drive.google.com/file/d/10id_hmbKbH0yqi623ylopyjR2cOeWI1D/preview', materials: [
            { id: 1, type: 'download', title: 'Atividade PDF (Módulo 1)', description: 'Suas atividades em PDF prontas para salvar ou imprimir!', url: 'https://drive.usercontent.google.com/download?id=13AX6QqVl2r7DteRYSiz7LOoS2Bf_j92N&export=download&authuser=4&confirm=t&uuid=065d9dd8-585b-45b0-9809-ef2a8f2d3d86&at=AN8xHorLiwfgkjusu3NEXx6u6m99:1757975696480' }
        ] },
        { id: 'alfabeto', title: 'Módulo 02', pdfUrl: 'https://drive.google.com/file/d/1Uxs4yPT9NuDHMRkAMfL85ZnCHZU-NbNQ/preview', materials: [
            { id: 1, type: 'download', title: 'Atividade PDF (Módulo 2)', description: 'Suas atividades em PDF prontas para salvar ou imprimir!', url: 'https://drive.usercontent.google.com/download?id=10NuIU2tU-n6VwryVQnYDnT086zcP-MI_&export=download&authuser=4&confirm=t&uuid=07e8fb4a-ea83-4e22-9fd5-4161f65cac62&at=AN8xHopIJLMDyuBFgkygtyE1NgGK:1757975701688' }
        ] },
        { id: 'silabas', title: 'Módulo 03', pdfUrl: 'https://drive.google.com/file/d/1k-s5EoRwlWloBICD7uWV-PbMsJNA27GB/preview', materials: [
            { id: 1, type: 'download', title: 'Atividade PDF (Módulo 3)', description: 'Suas atividades em PDF prontas para salvar ou imprimir!', url: 'https://drive.usercontent.google.com/download?id=1d60nSWLlqEEf6adVWUjKht5sdMjHBwRj&export=download&authuser=4&confirm=t&uuid=0d7ede6b-b81f-41db-be8b-ee28c44d4a73&at=AN8xHop-27mVkEAE2mAqFxSKVrZE:1757975706069' }
        ] },
        { id: 'fonico', title: 'Módulo 04', pdfUrl: 'https://drive.google.com/file/d/1jYvC01jsIArCRVa8Tc78JA7V8wbslkbT/preview', materials: [
            { id: 1, type: 'download', title: 'Atividade PDF (Módulo 4)', description: 'Suas atividades em PDF prontas para salvar ou imprimir!', url: 'https://drive.usercontent.google.com/download?id=11SFCIbyiFsf3lFLaNv5nApwc999SE5rF&export=download&authuser=4&confirm=t&uuid=d31f6031-c8d7-4650-a685-899360411b55&at=AN8xHooUQtvZ1yhPHfrsxAlxGbCD:1757975709320' }
        ] },
        { id: 'palavras', title: 'Módulo 05', pdfUrl: 'https://drive.google.com/file/d/1fUa0seaOrUeyRu-uHk4hTCMDXiMcl5kq/preview', materials: [
            { id: 1, type: 'download', title: 'Atividade PDF (Módulo 5)', description: 'Suas atividades em PDF prontas para salvar ou imprimir!', url: 'https://drive.usercontent.google.com/download?id=11xZJXPj35nP74zn-XxZAjRO8cvfsOf9o&export=download&authuser=4&confirm=t&uuid=5c5a823b-9ee8-4aa2-8946-05c93727a79c&at=AN8xHoqwa8qan28CiDzQz549HuWI:1757975712701' }
        ] },
        { id: 'escrita', title: 'Módulo 06', pdfUrl: 'https://drive.google.com/file/d/1-SnD4rkpr-6RMj_l-S-m1x1GAIhjAyCb/preview', materials: [
            { id: 1, type: 'download', title: 'Atividade PDF (Módulo 6)', description: 'Suas atividades em PDF prontas para salvar ou imprimir!', url: 'https://drive.usercontent.google.com/download?id=1s-UFG_TqWDgcN93nKd-iqnCf-WQ9PL5_&export=download&authuser=4&confirm=t&uuid=3acafe86-1a0c-47e1-85ab-630f0f987530&at=AN8xHooHBut2KQ96Ye0XyStz4P4t:1757975715463' }
        ] },
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


