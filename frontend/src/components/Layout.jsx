import React from 'react';
import clsx from 'clsx';

/**
 * Header component
 */
export const Header = ({ children, className = '' }) => (
  <header className={clsx('bg-white shadow-sm border-b border-gray-200', className)}>
    <div className="max-w-7xl mx-auto px-4 py-4">{children}</div>
  </header>
);

/**
 * Sidebar component
 */
export const Sidebar = ({ children, className = '' }) => (
  <aside className={clsx('bg-gray-900 text-white w-64 min-h-screen', className)}>
    {children}
  </aside>
);

/**
 * Container component
 */
export const Container = ({ children, className = '' }) => (
  <div className={clsx('max-w-7xl mx-auto px-4 py-6', className)}>
    {children}
  </div>
);

/**
 * Grid component
 */
export const Grid = ({ children, cols = 3, gap = 4, className = '' }) => (
  <div className={clsx(`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-${gap}`, className)}>
    {children}
  </div>
);

/**
 * Section component
 */
export const Section = ({ title, subtitle, children, className = '' }) => (
  <section className={className}>
    {title && (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

export default Header;
