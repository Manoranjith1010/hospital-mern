import React from 'react';
import clsx from 'clsx';

/**
 * Card component
 */
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={clsx('bg-white rounded-lg shadow-md p-6 border border-gray-200', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * Card header component
 */
export const CardHeader = ({ children, className = '' }) => (
  <div className={clsx('border-b border-gray-200 pb-4 mb-4', className)}>{children}</div>
);

/**
 * Card body component
 */
export const CardBody = ({ children, className = '' }) => (
  <div className={clsx('', className)}>{children}</div>
);

/**
 * Card footer component
 */
export const CardFooter = ({ children, className = '' }) => (
  <div className={clsx('border-t border-gray-200 pt-4 mt-4 flex gap-2 justify-end', className)}>
    {children}
  </div>
);

export default Card;
