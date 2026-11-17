import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { resolveFoodImage, FOOD_IMAGES } from '../assets/images';

interface ImageWithSkeletonProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  wrapperClassName?: string;
  skeletonClassName?: string;
  loading?: 'lazy' | 'eager';
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  skeletonClassName = '',
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = hasError ? FOOD_IMAGES.heroFeastSpread : resolveFoodImage(src);

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-10 bg-slate-200 dark:bg-[#1f2433] animate-pulse flex items-center justify-center ${skeletonClassName}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 dark:via-white/5 to-transparent" />
          <Utensils className="w-6 h-6 text-slate-400/50 dark:text-slate-600/70" />
        </div>
      )}

      <img
        src={resolvedSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          if (!hasError) {
            setHasError(true);
          } else {
            setLoaded(true);
          }
          onError?.(e);
        }}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...rest}
      />
    </div>
  );
};
