import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const AnimatedBackground = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // If the user prefers reduced motion, render a subtle static gradient instead of animations
  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-background via-cardBeige/30 to-primary/10"></div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Premium site-wide background wallpaper */}
      <div 
        className="absolute inset-0 opacity-50 dark:opacity-30 pointer-events-none transition-opacity duration-1000" 
        style={{ 
          backgroundImage: 'url(/artisan_hero_bg.png)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          filter: 'blur(16px)',
          transform: 'scale(1.05)' // Prevents blur edges from showing
        }}
      ></div>

      {/* Background base mesh overlay to ensure readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-cardBeige/70 via-background/80 to-background dark:from-surface/80 dark:via-background/90 dark:to-background"></div>

      {/* Animated Blob 1 - Top Right - Primary Color */}
      <motion.div
        animate={{
          x: [0, 50, 0, -30, 0],
          y: [0, -40, 20, 0, 0],
          scale: [1, 1.1, 0.9, 1.05, 1],
          rotate: [0, 45, -20, 10, 0],
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute -top-[10%] -right-[5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70"
      />

      {/* Animated Blob 2 - Bottom Left - Card Dark Beige */}
      <motion.div
        animate={{
          x: [0, -60, 20, -10, 0],
          y: [0, 40, -30, 10, 0],
          scale: [1, 0.9, 1.1, 0.95, 1],
          rotate: [0, -30, 20, -10, 0],
        }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
        className="absolute -bottom-[15%] -left-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-cardDarkBeige/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60"
      />

      {/* Animated Blob 3 - Middle Center (smaller) - Card Green */}
      <motion.div
        animate={{
          x: [0, 30, -40, 20, 0],
          y: [0, 60, -20, -50, 0],
          scale: [0.8, 1.2, 0.9, 1.1, 0.8],
        }}
        transition={{
          duration: 22,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: 5
        }}
        className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-cardGreen/20 blur-[90px] mix-blend-multiply dark:mix-blend-screen opacity-50"
      />
    </div>
  );
};
