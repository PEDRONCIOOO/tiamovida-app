'use server';

import { generateUniqueSlug, saveSlug } from '@/lib/utills';
import { revalidatePath } from 'next/cache';

/// Função para criar uma carta de amor
export async function createLetter(formData: FormData) {
  try {
    // Obter o token do reCAPTCHA do formulário
    const recaptchaToken = formData.get('recaptchaToken') as string;
    
    // Verificar se o token foi fornecido
    if (!recaptchaToken) {
      return { success: false, error: 'Verificação de reCAPTCHA necessária' };
    }
    
    // Verificar o token com a API do Google
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      {
        method: 'POST'
      }
    );
    
    const recaptchaData = await recaptchaResponse.json();
    
    // Se o reCAPTCHA não for válido, retornar erro
    if (!recaptchaData.success) {
      return { success: false, error: 'Falha na verificação do reCAPTCHA. Por favor, tente novamente.' };
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
    let audioUrl = null;
    let imageUrl = null;
    
    if (audioFile && audioFile.size > 0) {
      audioUrl = await uploadMedia(audioFile, 'audio');
    }
    
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadMedia(imageFile, 'image');
    }
    
    // Gerar slug único
    const slug = await generateUniqueSlug();
    
    // Preparar dados para salvar no Firestore
    const letterData = {
      coupleNames,
      relationshipDate,
      message,
      audioUrl,
      imageUrl,
      createdAt: new Date(),
    };
    
    // Usar um identificador temporário até que o cliente finalize a compra
    const tempUserId = 'guest-' + Date.now();
    const result = await saveSlug(slug, tempUserId, letterData);
    
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