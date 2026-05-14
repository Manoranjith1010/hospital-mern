import React from 'react';
import clsx from 'clsx';

/**
 * Badge component
 */
export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
};

/**
 * Alert component
 */
export const Alert = ({ children, type = 'info', title, onClose, className = '' }) => {
  const types = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={clsx('border-l-4 p-4 rounded', types[type], className)}>
      <div className="flex justify-between items-start gap-3">
        <div>
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div>{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-lg font-bold opacity-50 hover:opacity-100">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Loading spinner component
 */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={clsx('animate-spin', sizes[size], className)}>
      <div className="h-full w-full border-4 border-gray-200 border-t-blue-600 rounded-full" />
    </div>
  );
};

/**
 * Loading skeleton component
 */
export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={clsx('bg-gray-200 animate-pulse rounded', className)} />
      ))}
    </>
  );
};

export default Badge;
