'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  relationshipDate: string; // Format: DD/MM/YYYY
  startTime: string;        // Format: HH:MM
}

export default function CountdownTimer({ relationshipDate, startTime }: CountdownTimerProps) {
  const [timeElapsed, setTimeElapsed] = useState<string>('Calculando...');
  
  useEffect(() => {
    // Function to calculate elapsed time
    const calculateElapsedTime = () => {
      try {
        // Parse date and time
        const [day, month, year] = relationshipDate.split('/').map(Number);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        
        // Create JavaScript Date object
        const startDate = new Date(year, month - 1, day, startHours, startMinutes);
        const now = new Date();
        
        // Calculate difference in milliseconds
        const diffMs = now.getTime() - startDate.getTime();
        
        if (diffMs < 0) {
          return '0 anos, 0 meses, 0 dias, 0 horas, 0 minutos, 0 segundos';
        }
        
        // Calculate time units
        const seconds = Math.floor((diffMs / 1000) % 60);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const days = Math.floor((diffMs / (1000 * 60 * 60 * 24)) % 30);
        const months = Math.floor((diffMs / (1000 * 60 * 60 * 24 * 30)) % 12);
        const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
        
        // Format the result
        return `${formatUnit(years, 'ano', 'anos')}, ${formatUnit(months, 'mês', 'meses')}, ${formatUnit(days, 'dia', 'dias')}, ${formatUnit(hours, 'hora', 'horas')}, ${formatUnit(minutes, 'minuto', 'minutos')}, ${formatUnit(seconds, 'segundo', 'segundos')}`;
      } catch (err) {
        console.error('Error calculating time:', err);
        return 'Erro ao calcular o tempo';
      }
    };
    
    // Format singular/plural units
    const formatUnit = (value: number, singular: string, plural: string) => {
      return `${value} ${value === 1 ? singular : plural}`;
    };
    
    // Initial calculation
    setTimeElapsed(calculateElapsedTime());
    
    // Set up interval to update every second
    const intervalId = setInterval(() => {
      setTimeElapsed(calculateElapsedTime());
    }, 1000);
    
    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [relationshipDate, startTime]);
  
  return (
    <div>
      <div className="text-sm text-gray-400 mb-1">Juntos há:</div>
      <div className="text-pink-500 font-bold">{timeElapsed}</div>
    </div>
  );
}