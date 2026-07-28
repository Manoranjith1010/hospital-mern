import React from 'react';
import clsx from 'clsx';

/**
 * Table component
 */
export const Table = ({ children, className = '', ...props }) => (
  <div className="overflow-x-auto">
    <table className={clsx('w-full border-collapse text-left text-sm', className)} {...props}>
      {children}
    </table>
  </div>
);

/**
 * Table head component
 */
export const TableHead = ({ children }) => (
  <thead className="bg-gray-100 border-b-2 border-gray-300">
    {children}
  </thead>
);

/**
 * Table body component
 */
export const TableBody = ({ children }) => (
  <tbody>
    {children}
  </tbody>
);

/**
 * Table row component
 */
export const TableRow = ({ children, isHeader = false, className = '' }) => (
  <tr className={clsx('border-b border-gray-200 hover:bg-gray-50', isHeader && 'bg-gray-100', className)}>
    {children}
  </tr>
);

/**
 * Table cell component
 */
export const TableCell = ({ children, isHeader = false, className = '' }) => {
  const Component = isHeader ? 'th' : 'td';
  return (
    <Component
      className={clsx(
        'px-6 py-4',
        isHeader && 'font-semibold text-gray-700',
        className,
      )}
    >
      {children}
    </Component>
  );
};

export default Table;
