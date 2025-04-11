import { nanoid } from 'nanoid';
import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreError
} from 'firebase/firestore';

// Definindo interfaces para os dados
interface LetterData {
  status: string;
  // Adicione outros campos conforme necessário
  [key: string]: unknown; // Para campos adicionais, usando unknown em vez de any
}

interface SlugDocument {
  userId: string;
  letterData: LetterData;
  createdAt: Date;
  views: number;
  [key: string]: unknown; // Para outros campos, usando unknown em vez de any
}

interface LetterWithSlug extends SlugDocument {
  slug: string;
}

interface PaginationResult {
  success: boolean;
  letters: LetterWithSlug[];
  lastVisible: DocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
  error?: FirestoreError;
}

interface StatsResult {
  success: boolean;
  stats?: {
    totalLetters: number;
    paidLetters: number;
    pendingLetters: number;
    totalViews: number;
  };
  error?: FirestoreError;
}

interface SlugResult {
  success: boolean;
  slug?: string;
  error?: FirestoreError;
}

/**
 * Função para gerar slug único
 */
export const generateUniqueSlug = async (): Promise<string> => {
  const slug = nanoid(10); // Gera um ID de 10 caracteres
  
  // Verifica se o slug já existe no banco de dados
  const slugRef = doc(db, 'slugs', slug);
  const slugDoc = await getDoc(slugRef);
  
  // Se o slug já existir, gera outro recursivamente
  if (slugDoc.exists()) {
    return generateUniqueSlug();
  }
  
  return slug;
};

/**
 * Função para buscar cartas com paginação
 */
export const getLettersWithPagination = async (
  userId: string,
  limitCount: number = 10,
  lastDoc?: DocumentSnapshot<DocumentData> | null
): Promise<PaginationResult> => {
  try {
    let q = query(
      collection(db, 'slugs'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    // Se tiver um cursor de paginação
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    
    const letters: LetterWithSlug[] = [];
    let lastVisible: DocumentSnapshot<DocumentData> | null = null;
    
    querySnapshot.forEach((document: QueryDocumentSnapshot<DocumentData>) => {
      const data = document.data() as SlugDocument;
      letters.push({
        slug: document.id,
        ...data
      });
    });
    
    // Definir o último documento para paginação
    if (querySnapshot.docs.length > 0) {
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    }
    
    return { 
      success: true, 
      letters,
      lastVisible,
      hasMore: querySnapshot.docs.length === limitCount
    };
  } catch (error) {
    console.error('Erro ao buscar cartas do usuário:', error);
    return { 
      success: false, 
      letters: [],
      lastVisible: null,
      hasMore: false,
      error: error as FirestoreError 
    };
  }
};

/**
 * Função para salvar um novo slug
 */
export const saveSlug = async (
  slug: string, 
  userId: string, 
  letterData: LetterData
): Promise<SlugResult> => {
  try {
    await setDoc(doc(db, 'slugs', slug), {
      userId,
      letterData,
      createdAt: new Date(),
      views: 0
    });
    return { success: true, slug };
  } catch (error) {
    console.error('Erro ao salvar slug:', error);
    return { success: false, error: error as FirestoreError };
  }
};

/**
 * Função para buscar estatísticas do usuário
 */
export const getUserStats = async (userId: string): Promise<StatsResult> => {
  try {
    // Buscar total de cartas
    const lettersQuery = query(
      collection(db, 'slugs'),
      where('userId', '==', userId)
    );
    const lettersSnapshot = await getDocs(lettersQuery);
    
    // Buscar cartas pagas
    const paidLettersQuery = query(
      collection(db, 'slugs'),
      where('userId', '==', userId),
      where('letterData.status', '==', 'paid')
    );
    const paidLettersSnapshot = await getDocs(paidLettersQuery);
    
    // Buscar visualizações
    let totalViews = 0;
    lettersSnapshot.forEach(document => {
      const data = document.data() as SlugDocument;
      totalViews += data.views || 0;
    });
    
    return {
      success: true,
      stats: {
        totalLetters: lettersSnapshot.size,
        paidLetters: paidLettersSnapshot.size,
        pendingLetters: lettersSnapshot.size - paidLettersSnapshot.size,
        totalViews
      }
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas do usuário:', error);
    return { success: false, error: error as FirestoreError };
  }
};
