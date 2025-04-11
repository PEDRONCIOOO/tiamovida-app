'use server';

import { generateUniqueSlug, saveSlug } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { uploadMedia } from './uploadMedia';
import { sendSuccessEmail } from '@/lib/sendEmail';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * Função para criar uma carta de amor
 */
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
    const userEmail = formData.get('userEmail') as string;
    const userId = formData.get('userId') as string || null;
    
    // Verificar dados obrigatórios
    if (!coupleNames || !message) {
      return { success: false, error: 'Preencha todos os campos obrigatórios' };
    }
    
    // Fazer upload de arquivos
    let audioUrl = null;
    let imageUrl = null;
    
    if (audioFile && audioFile.size > 0) {
      audioUrl = await uploadMedia(audioFile, 'audio', userId);
    }
    
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadMedia(imageFile, 'image', userId);
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
      status: 'pending', // pending, paid, cancelled
      userEmail,
      userId: userId || `guest-${Date.now()}`
    };
    
    // Salvar no Firestore
    const result = await saveSlug(slug, letterData.userId, letterData);
    
    // Verificar se salvou com sucesso
    if (!result.success) {
      return { success: false, error: 'Erro ao salvar os dados' };
    }
    
    // Revalidar caminho para atualizar cache
    revalidatePath('/dashboard');
    
    // Se tiver email, enviar email de confirmação
    if (userEmail) {
      await sendSuccessEmail(
        userEmail, 
        coupleNames.split(' ')[0], 
        `${process.env.NEXT_PUBLIC_BASE_URL}/love/${slug}`
      );
    }
    
    return { 
      success: true,
      slug,
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/love/${slug}`,
      status: 'pending'
    };
  } catch (error) {
    console.error('Erro ao criar carta:', error);
    return { success: false, error: 'Ocorreu um erro ao criar sua carta de amor' };
  }
}

/**
 * Função para atualizar o status de pagamento de uma carta
 */
export async function updateLetterStatus(slug: string, status: 'paid' | 'cancelled') {
  try {
    const docRef = doc(db, 'slugs', slug);
    await updateDoc(docRef, {
      'letterData.status': status,
      'letterData.paidAt': status === 'paid' ? new Date() : null
    });
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar status da carta:', error);
    return { success: false, error: 'Erro ao atualizar status da carta' };
  }
}

/**
 * Função para excluir uma carta
 */
export async function deleteLetter(slug: string, userId: string) {
  try {
    // Verificar se o usuário é o dono da carta
    const slugDoc = await getDoc(doc(db, 'slugs', slug));
    
    if (!slugDoc.exists()) {
      return { success: false, error: 'Carta não encontrada' };
    }
    
    const data = slugDoc.data();
    
    if (data.userId !== userId) {
      return { success: false, error: 'Você não tem permissão para excluir esta carta' };
    }
    
    // Excluir arquivos de mídia
    if (data.letterData.audioUrl) {
      await deleteMedia(data.letterData.audioUrl);
    }
    
    if (data.letterData.imageUrl) {
      await deleteMedia(data.letterData.imageUrl);
    }
    
    // Excluir documento
    await deleteDoc(doc(db, 'slugs', slug));
    
    // Revalidar caminho
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir carta:', error);
    return { success: false, error: 'Ocorreu um erro ao excluir a carta' };
  }
}

// Importações adicionais necessárias
import { getDoc, deleteDoc } from 'firebase/firestore';
import { deleteMedia } from './uploadMedia';

// Adicione esta função ao arquivo existente

/**
 * Incrementa o contador de visualizações de uma carta
 */
export async function incrementLetterViews(slug: string) {
  try {
    const docRef = doc(db, 'slugs', slug);
    const letterDoc = await getDoc(docRef);
    
    if (!letterDoc.exists()) {
      return { success: false, error: 'Carta não encontrada' };
    }
    
    const data = letterDoc.data();
    const currentViews = data.views || 0;
    
    await updateDoc(docRef, {
      views: currentViews + 1,
      lastViewed: new Date()
    });
    
    return { success: true, views: currentViews + 1 };
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error);
    return { success: false, error: 'Erro ao incrementar visualizações' };
  }
}

// Firebase Configuration: Configuração completa do Firebase (Auth, Firestore, Storage)
// Server Actions:
// Upload de mídia (imagens e áudio)
// Criação de cartas de amor
// Verificação de pagamentos
// Envio de e-mails
// Mercado Pago Integration:
// Criação de pagamentos PIX
// Webhook para receber notificações
// Verificação de status de pagamentos
// Security:
// Regras de segurança do Firestore
// Middleware para proteção de rotas
// Validação de dados
// Optimization:
// Consultas otimizadas ao Firestore
// Paginação para listagens
// Contador de visualizações
// 15. Próximos Passos
// Testes: Testar todas as implementações
// Documentação: Documentar as APIs e Server Actions para os outros devs
// Monitoramento: Implementar logs e monitoramento para detectar problemas
// Escalabilidade: Considerar otimizações para escala maior