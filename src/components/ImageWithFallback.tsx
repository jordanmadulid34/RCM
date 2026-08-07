import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackText?: string;
}

const DEFAULT_FALLBACK_IMAGE = '/assets/images/rotary_connect.jpg';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  fallbackText,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [isFallbackTried, setIsFallbackTried] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!isFallbackTried && fallbackSrc && currentSrc !== fallbackSrc) {
      setIsFallbackTried(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`relative overflow-hidden w-full h-full bg-slate-900 flex items-center justify-center ${className}`}>
        <img
          src={DEFAULT_FALLBACK_IMAGE}
          alt={alt || 'Rotary Club of Makati'}
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800/30 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#F7A81B] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

