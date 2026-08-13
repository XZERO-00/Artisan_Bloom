import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export const AnimatedBackground = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const { scrollY } = useScroll();
  
  // Transform scroll position into an opacity value.
  // Full opacity at top, fades out significantly as you scroll down.
  const opacity = useTransform(scrollY, [0, 600], [1, 0.1]);
  // Subtle parallax effect for the background image
  const y = useTransform(scrollY, [0, 1000], [0, 100]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // If the user prefers reduced motion, render a subtle static gradient
  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-background via-surface to-background"></div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none flex justify-center">
      
      {/* Premium Image Background */}
      <motion.div
        style={{ opacity, y }}
        className="absolute inset-0 w-full max-w-[1920px] mx-auto h-[120vh] -top-[10vh]"
      >
        <div 
          className="w-full h-full opacity-70 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen transition-opacity duration-1000"
          style={{
            backgroundImage: 'url(/premium-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            // Fade out the image at the bottom so it doesn't clash with content sections
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0) 100%)'
          }}
        />
      </motion.div>

      {/* Very soft ambient floating lights (subtle movement) */}
      <motion.div
        animate={{
          x: [0, 30, 0, -20, 0],
          y: [0, -20, 15, 0, 0],
        }}
        transition={{
          duration: 35,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute top-0 right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-40"
      />

      {/* Noise Texture Overlay for a premium matte finish */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};
