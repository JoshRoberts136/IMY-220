import React from 'react';

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`max-w-[1200px] mx-auto px-5 py-5 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
