import { notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import CountdownTimer from '@/components/ui/CountdownTimer';

// Types for our letter data
interface LoveLetterData {
  slug: string;
  plan: 'basic' | 'premium';
  coupleNames: string;
  relationshipDate: string;
  startTime: string;
  message: string;
  photoUrls: string[];
  musicLink?: string | null;
  createdAt: Date; // Or firebase.firestore.Timestamp if you prefer
  validUntil: Date | null; // Or firebase.firestore.Timestamp | null
}

// Fetch the letter data
async function getLoveLetterData(slug: string) {
  try {
    const letterRef = doc(db, 'loveLetters', slug);
    const letterSnap = await getDoc(letterRef);
    
    if (!letterSnap.exists()) {
      return null;
    }
    
    return letterSnap.data() as LoveLetterData;
  } catch (err) {
    console.error(`Error fetching letter data for ${slug}:`, err);
    return null;
  }
}

// The page component
export default async function LoveLetterPage({ params }: { params: { slug: string } }) {
  const letterData = await getLoveLetterData(params.slug);
  
  if (!letterData) {
    notFound();
  }
  
  // Check if the letter is still valid (for basic plan)
  const now = new Date();
  if (letterData.validUntil && now > letterData.validUntil) {
    // Letter has expired
    return (
      <div className="min-h-screen bg-[#050510] text-white flex items-center justify-center">
        <div className="text-center p-8 max-w-lg">
          <h1 className="text-3xl font-bold mb-4">Carta expirada</h1>
          <p className="mb-8">Esta carta de amor expirou. O plano básico é válido por 1 ano.</p>
          <a href="/create" className="bg-pink-500 px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors">
            Criar uma nova carta
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#050510] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            {letterData.coupleNames}
          </h1>
          
          {/* Countdown */}
          <div className="mt-4">
            <CountdownTimer 
              relationshipDate={letterData.relationshipDate} 
              startTime={letterData.startTime} 
            />
          </div>
        </div>
        
        {/* Main content */}
        <div className="bg-[#191927] rounded-xl overflow-hidden shadow-xl">
          {/* Primary photo */}
          {letterData.photoUrls.length > 0 && (
            <div className="relative w-full aspect-video">
              <Image
                src={letterData.photoUrls[0]}
                alt={letterData.coupleNames}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          {/* Message */}
          <div className="p-8">
            <div className="text-xl italic text-center mb-8">
            {letterData.message}
            </div>
            
            {/* Photo grid for additional photos */}
            {letterData.photoUrls.length > 1 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Galeria de Fotos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {letterData.photoUrls.slice(1).map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={url}
                        alt={`${letterData.coupleNames} ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Music player (Premium only) */}
            {letterData.plan === 'premium' && letterData.musicLink && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Nossa Música</h3>
                {letterData.musicLink.includes('youtube.com') || letterData.musicLink.includes('youtu.be') ? (
                  <div className="aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${extractYoutubeId(letterData.musicLink)}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                ) : (
                  <audio controls className="w-full" src={letterData.musicLink}>
                    Seu navegador não suporta áudio HTML5.
                  </audio>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          Criado com ❤️ no tiamovida.com
          {letterData.plan === 'basic' && letterData.validUntil && (
            <div className="mt-2">
              Válido até {new Date(letterData.validUntil).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to extract YouTube video ID
function extractYoutubeId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : '';
}