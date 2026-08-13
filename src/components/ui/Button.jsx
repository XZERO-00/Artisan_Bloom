import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-7 py-3 rounded-full font-sans font-medium transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-textMain focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  
  const variants = {
    primary: "bg-textMain text-background hover:bg-textMain/90 hover:shadow-soft", 
    secondary: "bg-transparent border border-black/10 dark:border-white/10 text-textMain hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/20 dark:hover:border-white/20",
    ghost: "bg-transparent text-textMain hover:bg-black/5 dark:hover:bg-white/5",
    accent: "bg-primary text-textMain hover:bg-primaryHover hover:shadow-soft"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
