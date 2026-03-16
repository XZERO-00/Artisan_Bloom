import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-2.5 rounded-full font-medium transition-all duration-300 ease-out flex items-center justify-center cursor-pointer disabled:opacity-50";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primaryHover shadow-soft hover:shadow-minimal",
    secondary: "bg-surface border border-primary text-textMain hover:bg-background shadow-sm hover:shadow-soft",
    ghost: "bg-transparent text-textMain hover:bg-background",
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
