import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const Preloader = ({ onComplete }) => {
  useEffect(() => {
    // Lock scroll while preloading
    document.body.style.overflow = 'hidden';
    
    const timer = setTimeout(() => {
      document.body.style.overflow = 'unset';
      onComplete();
    }, 2800); // 2.8s total duration before fading out

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="flex flex-col items-center justify-center">
         
         <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 relative flex items-center justify-center"
         >
            <motion.img 
              src="/logo.png" 
              alt="The CraftNest Logo" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-xl z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            {/* Spinning decorative ring to match the circular logo */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute inset-0 -m-4 border-[2px] border-dashed border-[#DFAA9D]/40 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
              className="absolute inset-0 -m-8 border-[1px] border-[#DFAA9D]/20 rounded-full"
            />
         </motion.div>
         
         <div className="overflow-hidden flex items-center justify-center mt-4">
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.8 }}
             className="text-sm md:text-base font-medium text-textLight tracking-[0.3em] uppercase"
           >
             Handmade &bull; Heartfelt &bull; Unique
           </motion.p>
         </div>
         
      </div>
    </motion.div>
  );
};
