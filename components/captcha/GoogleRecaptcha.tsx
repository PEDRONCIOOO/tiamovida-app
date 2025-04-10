// /components/ui/GoogleRecaptcha.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface GoogleRecaptchaProps {
  onVerify: (token: string | null) => void;
}

const GoogleRecaptcha: React.FC<GoogleRecaptchaProps> = ({ onVerify }) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleChange = (token: string | null) => {
    onVerify(token);
  };

  const handleExpired = () => {
    onVerify(null);
  };

  return (
    <div className="flex justify-center my-4">
      {loaded && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
          onChange={handleChange}
          onExpired={handleExpired}
        />
      )}
    </div>
  );
};

export default GoogleRecaptcha;