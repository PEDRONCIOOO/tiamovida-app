
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Copy, MessageCircle, Check } from 'lucide-react';

interface ShareCardProps {
  slug: string;
}

const ShareCard: React.FC<ShareCardProps> = ({ slug }) => {
  const [copied, setCopied] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/love/${slug}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Não foi possível copiar o link');
    }
  };
  
  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=Olha%20o%20que%20eu%20fiz%20para%20voc%C3%AA:%20${encodeURIComponent(url)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2">Compartilhe seu amor</h3>
      <div className="flex items-center justify-between bg-slate-700 p-2 rounded mb-4">
        <p className="text-sm truncate mr-2">{url}</p>
        <button 
          onClick={copyToClipboard}
          className="p-2 bg-pink-500 rounded-full hover:bg-pink-600 transition"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 p-2 rounded transition"
        >
          <Copy size={18} />
          <span>Copiar Link</span>
        </button>
        
        <button 
          onClick={shareOnWhatsApp}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 p-2 rounded transition"
        >
          <MessageCircle size={18} />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
};

export default ShareCard;