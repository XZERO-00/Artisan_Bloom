import React from 'react';
import { Flower2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-surface py-12 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Flower2 className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <span className="font-serif text-lg font-bold tracking-wide text-textMain">
              ARTISAN BLOOM
            </span>
          </div>
          
          <div className="text-sm text-textLight flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          
          <div className="text-sm text-textLight">
            &copy; {new Date().getFullYear()} Artisan Bloom. Crafted with care.
          </div>
        </div>
      </div>
    </footer>
  );
};
