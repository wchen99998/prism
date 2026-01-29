import React from 'react';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const baseStyle =
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors';

const variants: Record<BadgeVariant, string> = {
  default: 'border-gray-200 bg-gray-100 text-gray-700',
  secondary: 'border-gray-300 bg-gray-900 text-white',
  outline: 'border-gray-300 bg-white text-gray-700',
  destructive: 'border-red-200 bg-red-50 text-red-600',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className = '',
  ...props
}) => (
  <div className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />
);
