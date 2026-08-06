import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AnimatedBackground } from './AnimatedBackground';

export const Layout = () => {
  return (
    <div className="min-h-screen text-textMain font-sans flex flex-col relative z-0">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-grow z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
