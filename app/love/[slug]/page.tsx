
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AudioPlayer from '@/components/audio-player';
import Loading from './loading';
import Image from 'next/image';

/// Definindo as propriedades da página
interface PageProps {
  params: {
    slug: string;
  };
}

// Função para buscar os dados da carta no Firestore
async function getLetterData(slug: string) {
  try {
    const letterDoc = await getDoc(doc(db, 'slugs', slug));
    
    if (!letterDoc.exists()) {
      return null;
    }
    
    return letterDoc.data();
  } catch (error) {
    console.error('Erro ao carregar carta:', error);
    return null;
  }
}
/// Página principal para exibir a carta de amor
export default async function LovePage({ params }: PageProps) {
  const { slug } = params;
  const letterData = await getLetterData(slug);
  
  if (!letterData) {
    notFound();
  }
  // Verifica se o usuário é o dono da carta
  return (
    <Suspense fallback={<Loading />}>
      <div className="max-w-md mx-auto bg-slate-800 rounded-lg overflow-hidden shadow-xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{letterData.title || 'Mensagem de Amor'}</h1>
          {letterData.coupleImage && (
            <div className="mb-6 relative h-64">
              <Image 
                src={letterData.coupleImage} 
                alt="Foto do casal" 
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>
          )}
          
          <div className="bg-slate-700 p-4 rounded-lg mb-6">
            <p className="text-lg whitespace-pre-line">{letterData.message}</p>
          </div>
          
          {letterData.audioUrl && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Mensagem de áudio</h3>
              <AudioPlayer audioUrl={letterData.audioUrl} />
            </div>
          )}
          
          <div className="flex justify-between items-center text-sm text-gray-400">
            <p>Relacionamento: {letterData.relationshipDuration}</p>
            <p>Criado em: {new Date(letterData.createdAt.toDate()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}