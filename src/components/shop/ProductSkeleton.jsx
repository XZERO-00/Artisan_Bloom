import React from 'react';
import { motion } from 'framer-motion';

export const ProductSkeleton = () => {
  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="w-full aspect-square rounded-[2rem] bg-black/5 animate-pulse mb-4 relative overflow-hidden">
        {/* Shimmer effect */}
        <motion.div 
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent skew-x-12"
          animate={{ translateX: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="w-full px-2 flex flex-col items-center">
        <div className="h-4 w-3/4 bg-black/5 animate-pulse rounded-full mb-2"></div>
        <div className="h-4 w-1/3 bg-black/5 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
};
