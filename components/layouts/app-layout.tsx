import React from 'react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto w-full min-h-screen lg:mt-64 mt-44 mb-16 lg:mb-32 h-full px-4">
      {children}
    </div>
  );
};

export default AppLayout;
