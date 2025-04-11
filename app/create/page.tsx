'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Camera, Calendar, Clock, Heart, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  
  // Form state
  const [formData, setFormData] = useState({
    coupleName: '',
    startDate: '',
    startTime: '',
    message: '',
    photos: [] as File[]
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
    // Clean up previous URLs to prevent memory leaks
    const prevUrls = [...previewUrls];
    
    // Create new URLs
    const newUrls = formData.photos.map(file => URL.createObjectURL(file));
    setPreviewUrls(newUrls);
    
    // Cleanup function to revoke object URLs
    return () => {
      prevUrls.forEach(url => URL.revokeObjectURL(url));
    };
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
    // Simple regex for dd/mm/yyyy format
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
    // Simple regex for HH:MM format
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
      
      // Only take up to the limit
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
      // Parse date and time
      const [day, month, year] = formData.startDate.split('/').map(Number);
      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
      
      // Create start date with time
      const startDate = new Date(year, month - 1, day, startHours, startMinutes, 0);
      
      // Get difference in milliseconds
      const diffMs = currentTime.getTime() - startDate.getTime();
      
      // Skip negative time (future dates)
      if (diffMs < 0) return "0 anos, 0 meses, 0 dias, 0 horas, 0 minutos e 0 segundos";
      
      // Calculate each time unit
      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const days = Math.floor((diffMs / (1000 * 60 * 60 * 24)) % 30.44); // Approximation
      
      // Calculate months (approximation)
      const months = Math.floor((diffMs / (1000 * 60 * 60 * 24 * 30.44)) % 12);
      
      // Calculate years
      const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
      
      // Format with proper singular/plural forms
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
  const formatUrlSlug = (name: string) => {
    if (!name) return 'seu-site';
    
    // Convert to lowercase and replace spaces with hyphens
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with hyphens
      .replace(/[^\w\-]+/g, '')   // Remove special characters
      .replace(/\-\-+/g, '-')     // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '');   // Remove leading and trailing hyphens
  };

  return (
    <div className="min-h-screen text-white bg-[#030D21]">
      {/* Language selector */}
      <div className="absolute top-5 right-5 bg-white/10 px-4 py-2 rounded-full text-sm flex items-center cursor-pointer hover:bg-white/20 transition-colors">
        PT <ChevronDown className="ml-2 h-4 w-4" />
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row lg:gap-10">
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
                        key={index}
                        className="relative h-fit rounded-lg overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image 
                          src={previewUrls[index] || URL.createObjectURL(photo)} 
                          alt={`Photo ${index + 1}`} 
                          className="w-full h-fit object-cover"
                          width={300}
                          height={300}
                        />
                        <motion.button
                          className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                          onClick={() => removePhoto(index)}
                          whileHover={{ scale: 1.1 }}
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
            className="bg-[#191927] rounded-xl overflow-hidden shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Browser dots */}
            <div className="bg-[#111] p-3 flex justify-left">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28ca41]"></div>
              </div>
            </div>

            {/* URL bar */}
            <div className="bg-white text-gray-800 mx-2 my-3 px-3 py-2 rounded text-center text-sm overflow-hidden text-ellipsis">
              <motion.span
                key={formatUrlSlug(formData.coupleName)}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                tiamovida.com/{formatUrlSlug(formData.coupleName)}
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
                    className="w-full h-fit flex flex-col items-center justify-center"
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
                          className="text-pink-300 font-medium text-xs md:text-sm"
                          animate={{ scale: [1, 1.03, 1] }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        >
                          {formatDetailedDuration()}
                        </motion.div>
                      </motion.div>
                    </div>
                    
                    {/* Photo preview */}
                    <motion.div 
                      className="relative w-full h-auto rounded-lg overflow-hidden mb-4"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {previewUrls.length > 0 && (
                        <Image 
                          src={previewUrls[0]} 
                          alt="Preview" 
                          className="w-full"
                          width={300}
                          height={300}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </motion.div>
                    
                    {/* Message preview */}
                    <motion.div 
                      className="text-center px-3 text-sm italic"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {formData.message || "Sua mensagem aparecerá aqui..."}
                    </motion.div>
                    
                    {/* Photo dots */}
                    {formData.photos.length > 1 && (
                      <motion.div 
                        className="flex justify-center mt-3 gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {Array.from({ length: Math.min(formData.photos.length, 5) }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-pink-500' : 'bg-gray-600'}`}
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
                    className="w-full h-full border-2 border-pink-500/50 rounded-lg flex items-center justify-center"
                  >
                    <motion.div 
                      className="text-center p-4"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="mx-auto mb-3 text-pink-500" size={48} />
                      <div className="text-gray-300">Prévia do seu site</div>
                      <div className="text-xs text-gray-500 mt-1">Preencha o formulário para ver</div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Create button */}
          <motion.button 
            className={`w-full mt-6 text-white font-bold py-4 px-6 rounded-lg transition-all ${
              isValid 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:translate-y-[-3px] hover:shadow-lg hover:shadow-pink-500/30'
                : 'bg-gray-700 cursor-not-allowed opacity-70'
            }`}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            disabled={!isValid}
          >
            <AnimatePresence mode="wait">
              {isValid ? (
                <motion.div
                  key="valid-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-lg">Criar nosso site</div>
                  <div className="text-sm font-normal mt-1">Tudo pronto para continuar</div>
                </motion.div>
              ) : (
                <motion.div
                  key="invalid-button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-lg">Criar nosso site</div>
                  <div className="text-sm font-normal mt-1 text-red-300">
                    Todos os dados devem ser preenchidos para continuar
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}