'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [letterData, setLetterData] = useState<{slug: string, coupleNames: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchLetterData() {
      if (!searchParams) {
        setError('Não foi possível obter os parâmetros da URL.');
        setLoading(false);
        return;
      }
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          throw new Error('No session ID provided');
        }
        
        // Query Firestore for letters with this session ID
        const lettersRef = collection(db, 'loveLetters');
        const q = query(lettersRef, where('stripeSessionId', '==', sessionId), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // The webhook might not have processed yet
          setLoading(true);
          
          // Poll every 3 seconds for up to 30 seconds
          let attempts = 0;
          const maxAttempts = 10;
          
          const checkInterval = setInterval(async () => {
            attempts++;
            const retryQuery = query(lettersRef, where('stripeSessionId', '==', sessionId), limit(1));
            const retrySnapshot = await getDocs(retryQuery);
            
            if (!retrySnapshot.empty) {
              clearInterval(checkInterval);
              const data = retrySnapshot.docs[0].data();
              setLetterData({
                slug: data.slug,
                coupleNames: data.coupleNames
              });
              setLoading(false);
            } 
            else if (attempts >= maxAttempts) {
              clearInterval(checkInterval);
              setError('Não foi possível encontrar sua página ainda. Ela será criada em breve.');
              setLoading(false);
            }
          }, 3000);
          
        } else {
          // Document found on first try
          const data = querySnapshot.docs[0].data();
          setLetterData({
            slug: data.slug,
            coupleNames: data.coupleNames
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching letter data:', err);
        setError('Ocorreu um erro ao buscar os dados da sua página');
        setLoading(false);
      }
    }
    
    fetchLetterData();
  }, [searchParams]);
  
  // Automatic redirect after success
  useEffect(() => {
    if (letterData?.slug) {
      const redirectTimer = setTimeout(() => {
        router.push(`/${letterData.slug}`);
      }, 5000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [letterData, router]);
  
  return (
    <div className="min-h-screen bg-[#050510] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#191927] rounded-xl p-8 text-center">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold mb-4">Pagamento confirmado!</h1>
        
        {loading ? (
          <div>
            <p className="mb-6">Estamos preparando sua página personalizada...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
            </div>
          </div>
        ) : error ? (
          <div>
            <p className="text-red-400 mb-6">{error}</p>
            <p className="mb-6">Não se preocupe, sua página está sendo criada e estará disponível em breve.</p>
          </div>
        ) : (
          <div>
            <p className="mb-6">
              Sua página para <span className="font-semibold text-pink-400">{letterData?.coupleNames}</span> foi criada com sucesso!
            </p>
            <p className="mb-8">
              Você será redirecionado em alguns segundos, ou pode clicar no botão abaixo.
            </p>
            <Link 
              href={`/${letterData?.slug}`}
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-lg text-white font-semibold hover:from-pink-400 hover:to-purple-500 transition-all"
            >
              Ver minha página 💕
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}