import React from 'react';


const Card = ({ 
  children, 
  variant = 'default',
  onClick,
  hover = false,
  className = '',
  ...props 
}) => {
  
  const baseStyles = `
    bg-[rgba(45,55,72,0.3)]
    border border-[rgba(139,0,0,0.25)]
    rounded-xl
    backdrop-blur-[5px]
    transition-all duration-300
    relative
    overflow-hidden
  `;

  const hoverStyles = hover ? `
    cursor-pointer
    hover:bg-[rgba(45,55,72,0.4)]
    hover:border-apex-orange
    hover:transform hover:-translate-y-0.5
    hover:shadow-[0_8px_25px_rgba(139,0,0,0.2)]
  ` : '';

  const variantStyles = {
    default: 'p-6',
    
    activity: `
      p-5
      border-l-4 border-l-apex-orange
      before:absolute before:inset-0 
      before:bg-gradient-to-r before:from-transparent before:via-[rgba(139,0,0,0.05)] before:to-transparent
      before:opacity-0 before:transition-opacity before:duration-300
      hover:before:opacity-100
      ${hover ? 'hover:translate-x-1 hover:translate-y-[-2px]' : ''}
    `,
    
    project: `
      p-5
      border-2
      hover:shadow-[0_15px_35px_rgba(139,0,0,0.2)]
    `,
    
    member: `
      p-4
      hover:border-apex-orange
      hover:translate-x-1
    `,
    
    feed: `
      p-4
      border-l-4 border-l-apex-orange
    `,

    commit: `
      p-4
      border border-[rgba(139,0,0,0.2)]
      hover:border-apex-orange
      hover:bg-[rgba(45,55,72,0.5)]
    `,
  };

  const gradientLine = variant === 'activity' || variant === 'project' ? (
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-apex-orange via-apex-red to-apex-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  ) : null;

  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${hoverStyles}
        ${variantStyles[variant]}
        ${className}
        group
      `}
      {...props}
    >
      {gradientLine}
      {children}
    </div>
  );
};


export const Container = ({ 
  children, 
  title,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-[rgba(45,55,72,0.3)]
        p-6
        rounded-xl
        border border-[rgba(139,0,0,0.25)]
        backdrop-blur-[5px]
        transition-all duration-300
        hover:border-apex-orange
        hover:bg-[rgba(45,55,72,0.4)]
        relative
        ${className}
      `}
      {...props}
    >
      {}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-apex-orange via-apex-red to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {title && (
        <h3 className="text-apex-orange font-bold mb-5 text-lg font-orbitron uppercase tracking-wide relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-apex-orange after:rounded">
          {title}
        </h3>
      )}
      
      {children}
    </div>
  );
};

export default Card;
