'use server';

import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

type MediaType = 'image' | 'audio';

/**
 * Faz upload de um arquivo para o Firebase Storage
 * @param file Arquivo a ser enviado
 * @param type Tipo de mídia (imagem ou áudio)
 * @param userId ID do usuário (opcional)
 * @returns URL do arquivo no Firebase Storage
 */
export async function uploadMedia(file: File, type: MediaType, userId?: string): Promise<string> {
  try {
    if (!file || file.size === 0) {
      throw new Error('Arquivo inválido');
    }

    // Validar tipo de arquivo
    if (type === 'image' && !file.type.startsWith('image/')) {
      throw new Error('O arquivo deve ser uma imagem');
    }

    if (type === 'audio' && !file.type.startsWith('audio/')) {
      throw new Error('O arquivo deve ser um áudio');
    }

    // Limitar tamanho (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(`O arquivo deve ter no máximo ${MAX_SIZE / (1024 * 1024)}MB`);
    }

    // Criar caminho para o arquivo
    const fileId = uuidv4();
    const extension = file.name.split('.').pop();
    const path = `${type}s/${userId || 'anonymous'}/${fileId}.${extension}`;
    
    // Referência para o arquivo no Storage
    const storageRef = ref(storage, path);
    
    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);
    
    // Fazer upload
    const snapshot = await uploadBytes(storageRef, fileBuffer, {
      contentType: file.type,
    });
    
    // Obter URL de download
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error: any) {
    console.error('Erro ao fazer upload:', error);
    throw new Error(`Erro ao fazer upload: ${error.message}`);
  }
}

/**
 * Função para remover um arquivo do Storage
 * @param fileUrl URL do arquivo a ser removido
 */
export async function deleteMedia(fileUrl: string): Promise<boolean> {
  try {
    // Extrair o caminho do arquivo da URL
    const fileRef = ref(storage, fileUrl);
    
    // Remover arquivo
    await deleteObject(fileRef);
    
    return true;
  } catch (error) {
    console.error('Erro ao remover arquivo:', error);
    return false;
  }
}

// Importação necessária para a função deleteMedia
import { deleteObject } from 'firebase/storage';