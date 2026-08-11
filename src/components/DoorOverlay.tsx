import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { LandingHero } from './LandingHero';

interface DoorOverlayProps {
  onBoardClick: () => void;
}

export const DoorOverlay: React.FC<DoorOverlayProps> = ({ onBoardClick }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(720);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Set viewport height dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setViewportHeight(window.innerHeight);
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hook to the window scrollY directly (tracks normal document scroll)
  const { scrollY } = useScroll();

  // Left and Right door panels slide out between scrollY = 0 and scrollY = viewportHeight * 0.90
  const leftX = useTransform(scrollY, [0, viewportHeight * 0.90], ['0%', '-100%']);
  const rightX = useTransform(scrollY, [0, viewportHeight * 0.90], ['0%', '100%']);

  // Edge borders that appear ONLY when the doors start opening (scrollY > 0)
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 1]);

  // Hero content (text, buttons, branding) fades out and scales down as doors start to open
  const heroOpacity = useTransform(scrollY, [0, viewportHeight * 0.50], [1, 0]);
  const heroScale = useTransform(scrollY, [0, viewportHeight * 0.50], [1, 0.96]);

  // Overall overlay opacity fades out at the very end of the transition (scrollY = 85% to 95% of viewport height)
  const overlayOpacity = useTransform(scrollY, [viewportHeight * 0.85, viewportHeight * 0.95], [1, 0]);

  // Handle visibility based on scroll position
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest >= viewportHeight * 0.95) {
      setShouldRender(false);
    } else {
      setShouldRender(true);
    }
  });

  if (prefersReducedMotion || !shouldRender) {
    return null;
  }

  return (
    <motion.div
      style={{ opacity: overlayOpacity }}
      className="fixed inset-0 w-screen h-screen z-[200] overflow-hidden flex select-none pointer-events-none"
    >
      {/* Left Door Panel */}
      <motion.div
        style={{ x: leftX }}
        className="w-[50.5vw] h-full bg-[#005030] relative flex flex-col justify-center items-end"
      >
        {/* Border that appears only when opening */}
        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute right-0 top-0 bottom-0 w-[1px] bg-[#003820]/40"
        />
      </motion.div>

      {/* Right Door Panel */}
      <motion.div
        style={{ x: rightX }}
        className="w-[50.5vw] h-full bg-[#005030] relative flex flex-col justify-center items-start"
      >
        {/* Border that appears only when opening */}
        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#003820]/40"
        />
      </motion.div>

      {/* Landing Hero Content Rendered on Top of the Doors */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="absolute inset-0 z-[210] pointer-events-none"
      >
        <LandingHero onBoardClick={onBoardClick} />
      </motion.div>
    </motion.div>
  );
};
