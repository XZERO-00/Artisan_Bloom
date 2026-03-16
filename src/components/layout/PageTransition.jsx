import React from 'react';
import { motion } from 'framer-motion';

export const PageTransition = ({ children }) => {
  return (
    <div style={{ perspective: '1200px' }} className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, rotateX: -10, y: 40 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
