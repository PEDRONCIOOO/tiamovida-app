
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { generateUniqueSlug, saveSlug } from '@/lib/utills';
import { revalidatePath } from 'next/cache';

/// Função para criar uma carta de amor
export async function createLetter(formData: FormData) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: 'Você precisa estar logado' };
    }
    
    // Extrair dados do formulário
    const coupleNames = formData.get('coupleNames') as string;
    const relationshipDate = formData.get('relationshipDate') as string;
    const message = formData.get('message') as string;
    const audioFile = formData.get('audioFile') as File;
    const imageFile = formData.get('imageFile') as File;
    
    // Verificar dados obrigatórios
    if (!coupleNames || !message) {
      return { success: false, error: 'Preencha todos os campos obrigatórios' };
    }
    
    // Fazer upload de arquivos (implementação depende do outro Dev responsável pelo upload)
    // Aqui apenas o conceito
    let audioUrl = null;
    let imageUrl = null;
    
    if (audioFile && audioFile.size > 0) {
      // Chamar função do outro Dev para upload (mockado aqui)
      audioUrl = await uploadMedia(audioFile, 'audio');
    }
    
    if (imageFile && imageFile.size > 0) {
      // Chamar função do outro Dev para upload (mockado aqui)
      imageUrl = await uploadMedia(imageFile, 'image');
    }
    
    // Gerar slug único
    const slug = await generateUniqueSlug();
    
    // Salvar dados no Firestore
    const letterData = {
      coupleNames,
      relationshipDate,
      message,
      audioUrl,
      imageUrl,
      userId: session.user.id,
      createdAt: new Date(),
    };
    
    const result = await saveSlug(slug, session.user.id, letterData);
    
    // Verificar se salvou com sucesso
    if (!result.success) {
      return { success: false, error: 'Erro ao salvar os dados' };
    }
    
    // Revalidar caminho para atualizar cache
    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      slug,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/love/${slug}` 
    };
    // Verificar se o slug foi salvo corretamente
  } catch (error) {
    console.error('Erro ao criar carta:', error);
    return { success: false, error: 'Ocorreu um erro ao criar sua carta de amor' };
  }
}

// Função mockada (será implementada por outro Dev)
async function uploadMedia(file: File, type: 'audio' | 'image') {
  // Implementação real será feita por outro Dev
  return `https://example.com/${type}/${file.name}`;
}