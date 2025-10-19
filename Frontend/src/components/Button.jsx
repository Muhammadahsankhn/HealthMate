// Button.js
import React from 'react';

const Button = ({ type = 'button', onClick, children, className = '', variant = 'primary' }) => {
  const base = 'px-4 py-2 rounded transition cursor-pointer font-medium';
  const variants = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600',
    ghost: 'bg-transparent text-emerald-600 border border-emerald-600 hover:bg-emerald-50',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </button>
  );
};

export default Button;