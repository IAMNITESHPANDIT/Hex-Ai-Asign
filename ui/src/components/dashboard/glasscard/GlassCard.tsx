import React, { ReactNode } from 'react';
import './glasscard.style.scss'
interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;

