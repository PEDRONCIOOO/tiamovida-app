import { nanoid } from 'nanoid';
import { db } from './firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Função para gerar slug único
 */
// Adicione estas funções ao arquivo existente

/**
 * Função para buscar cartas com paginação
 */
export const getLettersWithPagination = async (
  userId: string,
  limit: number = 10,
  startAfter?: any
) => {
  try {
    let q = query(
      collection(db, 'slugs'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    // Se tiver um cursor de paginação
    if (startAfter) {
      q = query(q, startAfter(startAfter));
    }
    
    const querySnapshot = await getDocs(q);
    
    const letters: any[] = [];
    let lastVisible = null;
    
    querySnapshot.forEach((doc) => {
      letters.push({
        slug: doc.id,
        ...doc.data()
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
      hasMore: querySnapshot.docs.length === limit
    };
  } catch (error) {
    console.error('Erro ao buscar cartas do usuário:', error);
    return { success: false, error };
  }
};

/**
 * Função para buscar estatísticas do usuário
 */
export const getUserStats = async (userId: string) => {
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
    
    // Buscar visualizações (implementação depende da sua estrutura de dados)
    // Esta é uma implementação simplificada
    let totalViews = 0;
    lettersSnapshot.forEach(doc => {
      const data = doc.data();
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
    return { success: false, error };
  }
};

// Importações adicionais necessárias
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
