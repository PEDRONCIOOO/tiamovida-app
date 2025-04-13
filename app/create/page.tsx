'use client';

import { useState, useEffect } from 'react';
import { Camera, Calendar, Clock, Heart, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
// Remove Link import if no longer needed elsewhere
// import Link from 'next/link'; 
import { loadStripe } from '@stripe/stripe-js';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase'; // Ensure this exists
import { ref, uploadBytes } from 'firebase/storage';

// Initialize Stripe outside the component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

// Debugging function
const logError = (step: string, error: unknown) => {
  console.error(`Error in ${step}:`, error);
  if (error instanceof Error) {
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  } else {
    console.error('Unknown error type:', error);
  }
};

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  
  // Form state
  const [formData, setFormData] = useState({
    coupleName: '',
    startDate: '',
    startTime: '',
    message: '',
    photos: [] as File[],
    musicLink: ''
  });

  // Validation state
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({
    coupleName: false,
    startDate: false,
    startTime: false,
    message: false,
    photos: false
  });

  // Preview state
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // State for countdown timer
  const [currentTime, setCurrentTime] = useState(new Date());

  // Loading state for checkout button
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Check form validity whenever form data changes
  useEffect(() => {
    const { coupleName, startDate, startTime, message, photos } = formData;
    const photosLimit = selectedPlan === 'basic' ? 3 : 7;
    
    const isFormValid = 
      coupleName.trim() !== '' && 
      isValidDate(startDate) && 
      isValidTime(startTime) && 
      message.trim() !== '' && 
      photos.length > 0 &&
      photos.length <= photosLimit;
    
    setIsValid(isFormValid);
  }, [formData, selectedPlan]);

  // Generate preview URLs for uploaded photos
  useEffect(() => {
    const prevUrls = [...previewUrls];
    const newUrls = formData.photos.map(file => URL.createObjectURL(file));
    setPreviewUrls(newUrls);
    
    return () => {
      prevUrls.forEach(url => URL.revokeObjectURL(url));
      // Also revoke new URLs when component unmounts or photos change again
      newUrls.forEach(url => URL.revokeObjectURL(url)); 
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.photos]);

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Input change handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Date validation
  const isValidDate = (dateString: string) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;
    
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  // Time validation
  const isValidTime = (timeString: string) => {
    const regex = /^\d{2}:\d{2}$/;
    if (!regex.test(timeString)) return false;
    
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
  };

  // Handle photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const photosLimit = selectedPlan === 'basic' ? 3 : 7;
      const selectedFiles = Array.from(e.target.files);
      
      const filesToAdd = selectedFiles.slice(0, photosLimit - formData.photos.length);
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...filesToAdd].slice(0, photosLimit)
      }));
      
      setTouched(prev => ({ ...prev, photos: true }));
    }
  };

  // Remove a photo
  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Enhanced relationship duration formatter
  const formatDetailedDuration = () => {
    if (!isValidDate(formData.startDate) || !isValidTime(formData.startTime)) 
      return "0 anos, 0 meses, 0 dias, 0 horas, 0 minutos e 0 segundos";
    
    try {
      const [day, month, year] = formData.startDate.split('/').map(Number);
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      const startDate = new Date(year, month - 1, day, startHours, startMinutes, 0);
      const diffMs = currentTime.getTime() - startDate.getTime();
      
      if (diffMs < 0) return "0 anos, 0 meses, 0 dias, 0 horas, 0 minutos e 0 segundos";
      
      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const days = Math.floor((diffMs / (1000 * 60 * 60 * 24)) % 30.44); 
      const months = Math.floor((diffMs / (1000 * 60 * 60 * 24 * 30.44)) % 12);
      const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
      
      return `${formatUnit(years, 'ano', 'anos')}, ${formatUnit(months, 'mês', 'meses')}, ${formatUnit(days, 'dia', 'dias')}, ${formatUnit(hours, 'hora', 'horas')}, ${formatUnit(minutes, 'minuto', 'minutos')} e ${formatUnit(seconds, 'segundo', 'segundos')}`;
    } catch {
      return "0 anos, 0 meses, 0 dias, 0 horas, 0 minutos e 0 segundos";
    }
  };

  // Helper to handle singular/plural forms
  const formatUnit = (value: number, singular: string, plural: string) => {
    return `${value} ${value === 1 ? singular : plural}`;
  };

  // Format couple name for URL
  const formatUrlSlug = (name: string): string => {
    if (!name) return 'seu-site';
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')       
      .replace(/[^\w\-]+/g, '')   
      .replace(/\-\-+/g, '-')     
      .replace(/^-+|-+$/g, '');   
  };

  // --- Checkout Handler ---
  const handleCheckout = async () => {
    if (!isValid || isCheckingOut) return; 

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      console.log("1. Starting checkout process");
      
      // 1. Generate a temporary ID
      const temporaryId = uuidv4();
      console.log("2. Generated temporaryId:", temporaryId);
      
      // 2. Create a slug from the couple name
      const baseSlug = formatUrlSlug(formData.coupleName);
      console.log("3. Generated baseSlug:", baseSlug);
      
      // 3. Store form data in Firestore
      try {
        console.log("4. Storing data in Firestore");
        await setDoc(doc(db, 'tempLetters', temporaryId), {
          coupleName: formData.coupleName,
          relationshipDate: formData.startDate,
          startTime: formData.startTime,
          message: formData.message,
          photoCount: formData.photos.length,
          musicLink: formData.musicLink || null,
          baseSlug: baseSlug,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'pending_payment'
        });
        console.log("5. Data stored successfully");
      } catch (firestoreError) {
        logError("Firestore storage", firestoreError);
        throw new Error(`Falha ao salvar os dados temporários: ${firestoreError instanceof Error ? firestoreError.message : 'Erro desconhecido'}`);
      }
      
      // 4. Upload photos
      console.log("6. Starting photo uploads");
      try {
        const photoUploadPromises = formData.photos.map(async (photo, index) => {
          console.log(`   Uploading photo ${index + 1}: ${photo.name}`);
          const fileRef = ref(storage, `temp-uploads/${temporaryId}/${index}-${photo.name}`);
          await uploadBytes(fileRef, photo);
          return index;
        });
        
        await Promise.all(photoUploadPromises);
        console.log("7. All photos uploaded successfully");
      } catch (storageError) {
        logError("Firebase Storage", storageError);
        throw new Error(`Falha ao fazer upload das fotos: ${storageError instanceof Error ? storageError.message : 'Erro desconhecido'}`);
      }
      
      // 5. Create checkout session
      console.log("8. Creating checkout session with data:", {
        plan: selectedPlan,
        temporaryId,
        coupleNames: formData.coupleName,
      });
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          plan: selectedPlan,
          temporaryId: temporaryId,
          coupleNames: formData.coupleName,
        }),
      });
      
      console.log("9. API response status:", response.status);
      
      const sessionData = await response.json();
      console.log("10. API response data:", sessionData);

      if (!response.ok) {
        throw new Error(sessionData.error || sessionData.details || 'Falha ao criar sessão de checkout');
      }

      // 6. Redirect to Stripe
      console.log("11. Redirecting to Stripe checkout");
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Falha ao carregar Stripe.');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionData.sessionId,
      });

      if (error) {
        logError("Stripe redirect", error);
        throw new Error(error.message || 'Falha ao redirecionar para o checkout');
      }

    } catch (error: unknown) {
      logError("Checkout process", error);
      let errorMessage = 'Ocorreu um erro inesperado.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      setCheckoutError(errorMessage);
      setIsCheckingOut(false);
    }
  };
  // --- End Checkout Handler ---

  return (
    <div className="min-h-screen text-white bg-[#030D21]">

      <div className="container w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row lg:gap-10">
        {/* Left panel - Form */}
        <motion.div 
          className="flex-grow lg:w-2/3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Quase lá!
          </motion.h1>
          <motion.h2 
            className="text-lg md:text-xl opacity-80 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Preencha os dados para criar seu contador
          </motion.h2>

          {/* Plans */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div 
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                selectedPlan === 'basic' 
                  ? 'border-pink-500 bg-pink-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-pink-500/50'
              }`}
              onClick={() => setSelectedPlan('basic')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              1 ano, 3 fotos e sem música - R$29
            </motion.div>
            <motion.div 
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                selectedPlan === 'premium' 
                  ? 'border-pink-500 bg-pink-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-pink-500/50'
              }`}
              onClick={() => setSelectedPlan('premium')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Pra sempre, 7 fotos e com música - R$49
            </motion.div>

            {/* YouTube Music Link - Only for Premium Plan */}
            <AnimatePresence>
              {selectedPlan === 'premium' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden md:col-span-2"
                >
                  <div className="border border-pink-500/30 rounded-lg p-4 bg-pink-500/5 mt-4 w-full">
                    <label className="block mb-2 text-white/80">
                      Link música do YouTube (Opcional):
                    </label>
                    <div className="relative w-full">
                      <motion.input 
                        type="text" 
                        name="musicLink"
                        value={formData.musicLink || ''}
                        onChange={handleInputChange}
                        placeholder="https://www.youtube.com/watch?v=..." 
                        className="w-full p-4 pl-11 bg-white/5 border border-white/10 rounded-lg focus:outline-none transition-colors focus:border-pink-500"
                        whileFocus={{ scale: 1.01 }}
                      />
                      <svg 
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        <path d="m12 16 4-4-4-4" />
                        <path d="M15.5 12H7" />
                      </svg>
                    </div>
                    <p className="mt-2 text-xs text-white/60">
                      Escolha uma música especial para tocar no seu site
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Form */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div>
              <label className="block mb-2 text-white/80">Nome do casal:</label>
              <motion.input 
                type="text" 
                name="coupleName"
                value={formData.coupleName}
                onChange={handleInputChange}
                placeholder="Pedro e Vitória (Não use emoji)" 
                className={`w-full p-4 bg-white/5 border rounded-lg focus:outline-none transition-colors ${
                  touched.coupleName && !formData.coupleName
                    ? 'border-red-500 bg-red-500/5' 
                    : 'border-white/10 focus:border-pink-500'
                }`}
                whileFocus={{ scale: 1.01 }}
                onBlur={() => setTouched(prev => ({ ...prev, coupleName: true }))}
              />
              {touched.coupleName && !formData.coupleName && (
                <motion.p 
                  className="mt-1 text-red-500 text-sm"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Por favor, adicione o nome do casal
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-2 text-white/80">Início do relacionamento:</label>
                <div className="relative">
                  <motion.input 
                    type="text" 
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    placeholder="dia/mês/ano (30/12/2022)" 
                    className={`w-full p-4 pl-11 bg-white/5 border rounded-lg focus:outline-none transition-colors ${
                      touched.startDate && !isValidDate(formData.startDate)
                        ? 'border-red-500 bg-red-500/5' 
                        : 'border-white/10 focus:border-pink-500'
                    }`}
                    whileFocus={{ scale: 1.01 }}
                    onBlur={() => setTouched(prev => ({ ...prev, startDate: true }))}
                  />
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                </div>
                {touched.startDate && !isValidDate(formData.startDate) && (
                  <motion.p 
                    className="mt-1 text-red-500 text-sm"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Data inválida, use o formato brasileiro: dia/mês/ano (ex: 30/12/2022)
                  </motion.p>
                )}
              </div>
              <div>
                <label className="block mb-2 text-white/80">Horário:</label>
                <div className="relative">
                  <motion.input 
                    type="text" 
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    placeholder="00:00" 
                    className={`w-full p-4 pl-11 bg-white/5 border rounded-lg focus:outline-none transition-colors ${
                      touched.startTime && !isValidTime(formData.startTime)
                        ? 'border-red-500 bg-red-500/5' 
                        : 'border-white/10 focus:border-pink-500'
                    }`}
                    whileFocus={{ scale: 1.01 }}
                    onBlur={() => setTouched(prev => ({ ...prev, startTime: true }))}
                  />
                  <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                </div>
                {touched.startTime && !isValidTime(formData.startTime) && (
                  <motion.p 
                    className="mt-1 text-red-500 text-sm"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Horário inválido, use o formato 00:00
                  </motion.p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-white/80">Mensagem:</label>
              <motion.textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Escreva sua linda mensagem aqui. Capricha hein! ❤️" 
                className={`w-full p-4 bg-white/5 border rounded-lg focus:outline-none transition-colors min-h-[150px] ${
                  touched.message && !formData.message
                    ? 'border-red-500 bg-red-500/5' 
                    : 'border-white/10 focus:border-pink-500'
                }`}
                whileFocus={{ scale: 1.01 }}
                onBlur={() => setTouched(prev => ({ ...prev, message: true }))}
              />
              {touched.message && !formData.message && (
                <motion.p 
                  className="mt-1 text-red-500 text-sm"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Por favor, adicione uma mensagem
                </motion.p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-white/80">
                Fotos do casal (Máximo {selectedPlan === 'basic' ? '3' : '7'}):
              </label>
              
              {/* Photo upload */}
              <div className="mb-3">
                <label htmlFor="photo-upload">
                  <motion.div 
                    className={`border border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      touched.photos && formData.photos.length === 0
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-white/20 hover:border-pink-500 hover:bg-pink-500/10'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Camera className="w-6 h-6 mb-2" />
                    <span>Escolher fotos do casal (Máximo {selectedPlan === 'basic' ? '3' : '7'})</span>
                    <input 
                      id="photo-upload" 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      onBlur={() => setTouched(prev => ({ ...prev, photos: true }))}
                    />
                  </motion.div>
                </label>
              </div>
              
              {/* Photo preview */}
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <AnimatePresence>
                    {formData.photos.map((photo, index) => (
                      <motion.div 
                        key={previewUrls[index] || index} // Use URL as key if available
                        className="relative h-fit rounded-lg overflow-hidden bg-gray-800" // Added a background color for empty state
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Conditionally render the Image component */}
                        {previewUrls[index] && (
                          <Image 
                            src={previewUrls[index]} // Now we know it's a valid string
                            alt={`Photo ${index + 1}`} 
                            className="w-full h-auto object-cover aspect-square" // Added aspect-square
                            width={150} // Adjusted size
                            height={150} // Adjusted size
                            onError={(e) => { // Handle potential loading errors
                              console.error("Image load error:", previewUrls[index]);
                              // Optionally, you could hide the image or show a placeholder within this div
                              e.currentTarget.style.display = 'none'; // Example: hide on error
                            }}
                          />
                        )}
                        <motion.button
                          className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white" // Added text-white
                          onClick={() => removePhoto(index)}
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,0,0,0.7)' }} // Red hover
                          whileTap={{ scale: 0.9 }}
                        >
                          <XCircle size={16} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              
              {touched.photos && formData.photos.length === 0 && (
                <motion.p 
                  className="mt-1 text-red-500 text-sm"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Por favor, adicione pelo menos uma foto
                </motion.p>
              )}
              
              {formData.photos.length > 0 && formData.photos.length === (selectedPlan === 'basic' ? 3 : 7) && (
                <motion.p 
                  className="mt-1 text-amber-500 text-sm"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Limite máximo de fotos atingido
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Right panel - Preview */}
        <motion.div 
          className="mt-10 lg:mt-0 lg:w-1/3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div 
            className="bg-[#191927] rounded-xl overflow-hidden shadow-xl sticky top-10" // Added sticky positioning
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Browser dots */}
            <div className="bg-[#111] p-3 flex justify-start items-center"> {/* Adjusted alignment */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
              </div>
            </div>

            {/* URL bar */}
            <div className="bg-white text-gray-800 mx-4 my-2 px-3 py-1.5 rounded text-left text-sm overflow-hidden text-ellipsis whitespace-nowrap"> {/* Adjusted styles */}
              <motion.span
                key={formatUrlSlug(formData.coupleName)}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                🔒 tiamovida.com/{formatUrlSlug(formData.coupleName)}
              </motion.span>
            </div>

            {/* Preview content */}
            <div className="p-4 min-h-[500px] bg-gradient-to-b from-[#121220] to-[#1E1E30]">
              <AnimatePresence mode="wait">
                {formData.photos.length > 0 ? (
                  <motion.div
                    key="preview-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col items-center justify-start" // Adjusted alignment
                  >
                    {/* Top section */}
                    <div className="text-center mb-4 w-full">
                      <motion.h2 
                        className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {formData.coupleName || "Nome do Casal"}
                      </motion.h2>
                      
                      <motion.div 
                        className="text-sm text-gray-300 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="text-xs mb-1 opacity-60">Estão juntos há:</div>
                        <motion.div 
                          className="text-pink-300 font-medium text-xs md:text-sm leading-tight" // Adjusted line-height
                          animate={{ scale: [1, 1.03, 1] }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        >
                          {formatDetailedDuration()}
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    {/* Photo preview */}
                    <motion.div 
                      className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 shadow-lg" // Adjusted aspect ratio and added shadow
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {previewUrls.length > 0 && (
                        <Image 
                          src={previewUrls[0]} 
                          alt="Preview" 
                          className="w-full h-full object-cover" // Ensure image covers the area
                          width={400} // Increased size
                          height={300} // Increased size
                          priority // Load first image faster
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div> {/* Softer gradient */}
                    </motion.div>
                    
                    {/* Message preview */}
                    <motion.div 
                      className="text-center px-3 text-sm italic text-gray-300" // Adjusted color
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {formData.message || "Sua mensagem aparecerá aqui..."}
                    </motion.div>
                    
                    {/* Photo dots */}
                    {formData.photos.length > 1 && (
                      <motion.div 
                        className="flex justify-center mt-4 gap-1.5" // Increased gap
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {Array.from({ length: Math.min(formData.photos.length, 5) }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full transition-colors ${i === 0 ? 'bg-pink-500 scale-110' : 'bg-gray-600'}`} // Highlight first dot
                          ></div>
                        ))}
                        {formData.photos.length > 5 && (
                          <div className="text-xs text-gray-400 ml-1">+{formData.photos.length - 5}</div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full border-2 border-dashed border-pink-500/30 rounded-lg flex items-center justify-center" // Dashed border
                  >
                    <motion.div 
                      className="text-center p-4"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="mx-auto mb-3 text-pink-500 opacity-70" size={48} />
                      <div className="text-gray-300 font-medium">Prévia do seu site</div>
                      <div className="text-xs text-gray-500 mt-1">Preencha o formulário para ver</div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* --- Updated Create Button --- */}
          <motion.button 
            onClick={handleCheckout} // Call handleCheckout on click
            className={`w-full mt-6 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 ${
              isValid && !isCheckingOut
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:translate-y-[-3px] hover:shadow-lg hover:shadow-pink-500/30 cursor-pointer'
                : 'bg-gray-700 cursor-not-allowed opacity-70'
            }`}
            whileHover={(isValid && !isCheckingOut) ? { scale: 1.02 } : {}}
            whileTap={(isValid && !isCheckingOut) ? { scale: 0.98 } : {}}
            disabled={!isValid || isCheckingOut} // Disable if not valid OR if checking out
          >
            <AnimatePresence mode="wait">
              {isCheckingOut ? (
                 <motion.div
                  key="loading-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center"
                >
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </motion.div>
              ) : isValid ? (
                <motion.div
                  key="valid-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center" // Center text
                >
                  <div className="text-lg">Criar nosso site</div> {/* Removed Link */}
                  <div className="text-sm font-normal mt-1">Tudo pronto para continuar</div>
                </motion.div>
              ) : (
                <motion.div
                  key="invalid-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center" // Center text
                >
                  <div className="text-lg">Criar nosso site</div>
                  <div className="text-sm font-normal mt-1 text-red-300">
                    Todos os dados devem ser preenchidos
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          {/* Display Checkout Error */}
          {checkoutError && (
             <motion.div 
              className="mt-3 text-center text-red-400 text-sm bg-red-500/10 p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {checkoutError}
            </motion.div>
          )}
          {/* --- End Updated Create Button --- */}
        </motion.div>
      </div>
    </div>
  );
}