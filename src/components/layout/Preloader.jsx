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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
         >
           <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#DFAA9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
             {/* Left Leaf */}
             <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
               d="M12 15c-3 0-5-2-5-5 0-3 2-5 5-5"
             />
             {/* Right Leaf */}
             <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
               d="M12 15c3 0 5-2 5-5 0-3-2-5-5-5"
             />
             {/* Center Bud */}
             <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1.2, ease: "easeInOut", delay: 0.6 }}
               d="M12 5v10"
             />
             {/* Bottom Left Petal */}
             <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1.2, ease: "easeInOut", delay: 0.6 }}
               d="M12 15c-2 2-3 4-3 6"
             />
             {/* Bottom Right Petal */}
             <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1.2, ease: "easeInOut", delay: 0.6 }}
               d="M12 15c2 2 3 4 3 6"
             />
             {/* Stem */}
             <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
               d="M12 21v2"
             />
           </svg>
         </motion.div>
         
         <div className="overflow-hidden flex items-center justify-center mb-1">
           <motion.h1 
             initial={{ y: "100%" }}
             animate={{ y: 0 }}
             transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.4 }}
             className="text-4xl md:text-5xl font-serif text-textMain tracking-[0.2em] font-bold"
           >
             ARTISAN
           </motion.h1>
         </div>
         <div className="overflow-hidden flex items-center justify-center">
           <motion.h1 
             initial={{ y: "100%" }}
             animate={{ y: 0 }}
             transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.6 }}
             className="text-4xl md:text-5xl font-serif text-[#DFAA9D] tracking-[0.2em]"
           >
             BLOOM
           </motion.h1>
         </div>
         
      </div>
    </motion.div>
  );
};
