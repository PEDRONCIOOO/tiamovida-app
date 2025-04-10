
import { nanoid } from 'nanoid';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Função para gerar slug único
export const generateUniqueSlug = async (): Promise<string> => {
  const slug = nanoid(10); // Gerar string aleatória de 10 caracteres
  
  // Verificar se o slug já existe
  const slugDoc = await getDoc(doc(db, 'slugs', slug));
  
  if (slugDoc.exists()) {
    // Se existe, gerar outro recursivamente
    return generateUniqueSlug();
  }
  
  // Se não existe, retornar o slug
  return slug;
};

// Função para salvar relacionamento entre slug e usuário
export const saveSlug = async (slug: string, userId: string, letterData: Record<string, unknown>) => {
  try {
    // Salvar no Firestore
    await setDoc(doc(db, 'slugs', slug), {
      userId,
      letterData,
      createdAt: new Date(),
    });
    
    return { success: true, slug };
  } catch (error) {
    return { success: false, error };
  }
};