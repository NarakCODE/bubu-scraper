import React from 'react';
import Header from './header';
import { Footer } from './footer';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto w-full flex flex-col justify-center h-full px-4">
      <Header />

      <main className="min-h-screen w-full h-full">{children}</main>

      <Footer />
    </div>
  );
};

export default AppLayout;
