import React from 'react';

const FormInput = ({ 
  label, 
  icon: Icon,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  id,
  rows,
  className = '',
  ...props
}) => {
  const inputId = id || `input-${name}`;
  const isTextarea = type === 'textarea';

  const inputClasses = `
    w-full px-4 py-4
    bg-[rgba(20,20,20,0.9)] 
    border-2 border-gray-600
    rounded-md
    text-white
    font-rajdhani text-base
    transition-all duration-300
    placeholder:text-gray-500
    focus:outline-none 
    focus:border-apex-orange 
    focus:shadow-[0_0_15px_rgba(139,0,0,0.3)]
    focus:bg-gray-700
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  return (
    <div className="mb-6">
      {label && (
        <label 
          htmlFor={inputId} 
          className="flex items-center mb-2 text-gray-300 font-semibold uppercase tracking-wide text-xs"
        >
          {Icon && <Icon size={16} className="mr-2" />}
          {label}
        </label>
      )}
      
      {isTextarea ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows || 3}
          className={`${inputClasses} resize-y min-h-[80px]`}
          {...props}
        />
      ) : (
        <input
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
      )}
    </div>
  );
};

export default FormInput;
