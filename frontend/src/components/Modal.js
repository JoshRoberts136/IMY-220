import React from 'react';
import { X } from 'lucide-react';


const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '500px',
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
      className="bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-[rgba(10,10,10,0.95)] border-2 border-apex-orange rounded-xl p-8 w-[90%] max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(139,0,0,0.3)] relative ${className}`}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-orbitron text-2xl font-bold text-apex-orange m-0">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-gray-400 cursor-pointer p-1 rounded transition-colors duration-300 hover:text-apex-orange"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {}
        {children}
      </div>
    </div>
  );
};

export default Modal;
