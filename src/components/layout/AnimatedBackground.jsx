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
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-background via-surface to-background"></div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Animated Blob 1 - Top Right - Primary Color */}
      <motion.div
        animate={{
          x: [0, 20, 0, -10, 0],
          y: [0, -20, 10, 0, 0],
          scale: [1, 1.02, 0.98, 1.01, 1],
        }}
        transition={{
          duration: 35,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute -top-[10%] -right-[5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-primary/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40"
      />

      {/* Animated Blob 2 - Bottom Left - Card Dark Beige */}
      <motion.div
        animate={{
          x: [0, -30, 10, -5, 0],
          y: [0, 20, -15, 5, 0],
          scale: [1, 0.98, 1.02, 0.99, 1],
        }}
        transition={{
          duration: 40,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
        className="absolute -bottom-[15%] -left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-cardDarkBeige/10 blur-[140px] mix-blend-multiply dark:mix-blend-screen opacity-30"
      />

      {/* Noise Texture Overlay for a premium matte feel */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};
