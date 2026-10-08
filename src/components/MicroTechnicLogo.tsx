import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'white';
}

export const MicroTechnicLogo: React.FC<LogoProps> = ({ className = 'h-8', variant = 'full' }) => {
  if (variant === 'mark') {
    return (
      <img
        src="/micro-technic-mark.svg"
        alt="Micro Technic Node Symbol"
        className={`${className} w-auto object-contain shrink-0`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <img
        src="/micro-technic-logo.svg"
        alt="Micro Technic"
        className={`${className} w-auto object-contain shrink-0`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
