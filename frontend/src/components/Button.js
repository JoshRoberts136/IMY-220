import React from 'react';

/**
 * Reusable Tailwind Button Component
 * Variants: primary, secondary, warning, danger, disabled
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  onClick, 
  disabled = false, 
  type = 'button',
  className = '',
  ...props 
}) => {
  
  const baseStyles = `
    flex items-center justify-center gap-2
    font-rajdhani font-semibold
    cursor-pointer transition-all duration-300
    uppercase tracking-wider
    relative overflow-hidden
    disabled:opacity-70 disabled:cursor-not-allowed
    group
  `;

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantStyles = {
    primary: `
      bg-apex-orange border-2 border-apex-red text-white
      hover:shadow-[0_0_20px_rgba(139,0,0,0.5)]
      before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0
      before:bg-apex-red before:-z-10
      before:transition-transform before:duration-300
      before:origin-right before:scale-x-0
      hover:before:scale-x-100 hover:before:origin-left
    `,
    secondary: `
      bg-transparent border-2 border-gray-500 text-gray-400
      hover:border-apex-orange hover:text-apex-orange
      hover:bg-[rgba(139,0,0,0.1)]
    `,
    warning: `
      bg-transparent border-2 border-apex-orange text-apex-orange
      hover:bg-apex-orange hover:text-white
      hover:shadow-[0_0_20px_rgba(139,0,0,0.5)]
    `,
    danger: `
      bg-transparent border-2 border-red-500 text-red-500
      hover:bg-red-500 hover:text-white
      hover:shadow-[0_0_20px_rgba(255,68,68,0.5)]
    `,
    disabled: `
      bg-transparent border-2 border-gray-600 text-gray-500
      cursor-not-allowed opacity-70
    `,
  };

  const clipPathStyle = variant !== 'secondary' ? {
    clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)'
  } : {};

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${disabled ? variantStyles.disabled : variantStyles[variant]}
        ${className}
      `}
      style={clipPathStyle}
      {...props}
    >
      {Icon && <Icon size={16} className="relative z-10" />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
