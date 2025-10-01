import React from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Modal Component with Tailwind
 * Wraps content in a centered overlay with backdrop blur
 */
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
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-[9999]"
      onClick={onClose}
    >
      <div
        className={`bg-[rgba(10,10,10,0.95)] border-2 border-apex-orange rounded-xl p-8 w-[90%] max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(139,0,0,0.3)] relative ${className}`}
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
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

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
