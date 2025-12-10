import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

export function Avatar({ 
  src, 
  alt, 
  fallback,
  className = ''
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className={`ds-avatar ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="ds-avatar-image"
          onError={() => setImageError(true)}
        />
      ) : fallback ? (
        <span className="ds-avatar-fallback">
          {fallback}
        </span>
      ) : (
        <User size={20} className="ds-avatar-icon" />
      )}
    </div>
  );
}
