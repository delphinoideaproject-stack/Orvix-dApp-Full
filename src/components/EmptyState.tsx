import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, actionText, onAction, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full my-6 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg2)] flex items-center justify-center mb-6 border border-[var(--border)] shadow-inner">
        <Icon className="w-8 h-8 text-[var(--accent)]" />
      </div>
      <h3 className="text-xl font-bold text-[var(--text)] mb-2">{title}</h3>
      <p className="text-[var(--text2)] max-w-md mb-8 leading-relaxed">{description}</p>
      
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
}
