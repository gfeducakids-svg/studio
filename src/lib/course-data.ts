// This file would ideally fetch data from a database like Firestore
// For now, it returns static data to simulate that.

// Mocks the structure we'd expect from Firestore
interface Material {
    id: number;
    type: 'video' | 'pdf' | 'link' | 'download' | 'atividade';
    title: string;
}

interface Submodule {
    id: string;
    title: string;
    imageUrl: string; // Changed from pdfUrl to imageUrl
    materials: Material[];
}

interface Course {
    id: string;
    title: string;
    submodules: Submodule[];
}


const grafismoFoneticoData: Course = {
    id: 'grafismo-fonetico',
    title: 'Método de Grafismo Fonético',
    submodules: [
        { id: 'intro', title: 'Introdução', imageUrl: 'https://i.imgur.com/ddFiaYV.jpeg', materials: [{ id: 1, type: 'video', title: 'Boas-vindas'}] },
        { id: 'pre-alf', title: 'Pré-Alfabetização', imageUrl: 'https://i.imgur.com/bf7bsC6.jpeg', materials: [{ id: 1, type: 'video', title: 'Aula 1'}, {id: 2, type: 'pdf', title: 'Exercício de Traços'}] },
        { id: 'alfabeto', title: 'Apresentando o Alfabeto', imageUrl: 'https://i.imgur.com/CK4iI9s.png', materials: [{ id: 1, type: 'video', title: 'As Vogais'}, {id: 2, type: 'pdf', title: 'Cartilha do Alfabeto'}, {id: 3, type: 'download', title: 'Áudios das Letras'}] },
        { id: 'silabas', title: 'Sílabas Simples', imageUrl: 'https://i.imgur.com/qhAfaY6.png', materials: [{ id: 1, type: 'video', title: 'BA-BE-BI-BO-BU'}, {id: 2, type: 'pdf', title: 'Tabela de Sílabas'}] },
        { id: 'fonico', title: 'Método Fônico', imageUrl: 'https://i.imgur.com/ANDkcA9.png', materials: [] },
        { id: 'palavras', title: 'Formação de Palavras e Frases', imageUrl: 'https://i.imgur.com/ovE1zBu.png', materials: [] },
        { id: 'escrita', title: 'Escrita e Compreensão Leitora', imageUrl: 'https://i.imgur.com/oIYeTTT.jpeg', materials: [] },
        { id: 'bonus', title: 'Bônus', imageUrl: 'https://i.imgur.com/07KphCZ.png', materials: [] },
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
