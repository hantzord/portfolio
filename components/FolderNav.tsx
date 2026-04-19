'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'home',     label: 'Home',           section: 'home' },
  { id: 'projects', label: 'Featured Work',  section: 'projects' },
  { id: 'toolbox',  label: 'Toolbox',        section: 'toolbox' },
  { id: 'about',    label: 'About & Contact',section: 'about' },
];

export default function FolderNav() {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offsets = tabs.map((t) => {
        const el = document.getElementById(t.section);
        if (!el) return { id: t.id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id: t.id, top: rect.top };
      });

      // Find the section that is closest to a point a bit below the top of the viewport
      offsets.sort((a, b) => Math.abs(a.top - 200) - Math.abs(b.top - 200));
      setActive(offsets[0].id);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    setMenuOpen(false);
  };

  const activeIndex = tabs.findIndex(t => t.id === active);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 flex flex-col justify-center items-center gap-1.5 w-12 h-12 bg-eggshell border-2 border-royal rounded-xl shadow-[4px_4px_0px_0px_#0055FF] transition-all"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`w-6 h-[2.5px] bg-royal rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-[2.5px] bg-royal rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-[2.5px] bg-royal rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-eggshell/95 backdrop-blur-md flex flex-col items-center justify-center md:hidden"
          >
             <div className="flex flex-col gap-10 items-start relative" style={{ perspective: '800px' }}>
                {tabs.map((tab, idx) => {
                  const distance = idx - activeIndex;
                  const absDistance = Math.abs(distance);
                  const isActive = absDistance === 0;

                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => scrollTo(tab.section)}
                      className="relative flex items-center gap-4 text-5xl sm:text-6xl font-gochi transition-all duration-500 whitespace-nowrap"
                      style={{ fontFamily: '"Gochi Hand", cursive' }}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : Math.max(0.15, 0.7 - absDistance * 0.25),
                        scale: isActive ? 1.15 : Math.max(0.65, 1 - absDistance * 0.15),
                        filter: isActive ? 'blur(0px)' : `blur(${absDistance * 2.5}px)`,
                        rotateX: distance * -20,
                        color: isActive ? '#0055FF' : '#4b5563', // royal vs ink-muted
                      }}
                    >
                      {isActive && (
                        <motion.span 
                          layoutId="arrow-mobile"
                          className="absolute -left-12 text-royal font-mono"
                        >
                          -&gt;
                        </motion.span>
                      )}
                      {tab.label}
                    </motion.button>
                  );
                })}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Left Fade Gradient */}
      <div className="hidden md:block fixed left-0 top-0 bottom-0 w-48 lg:w-64 bg-gradient-to-r from-eggshell via-eggshell/90 to-transparent z-30 pointer-events-none" />

      {/* Desktop Wheel Sidebar */}
      <div className="hidden md:flex fixed left-6 lg:left-10 top-0 bottom-0 z-40 flex-col justify-center items-start w-48 lg:w-56 pointer-events-none" style={{ perspective: '800px' }}>
        <div className="relative w-full h-full pointer-events-auto flex flex-col justify-center">
          {tabs.map((tab, idx) => {
            const distance = idx - activeIndex;
            const absDistance = Math.abs(distance);
            const isActive = absDistance === 0;

            // Calculate vertical spacing with a larger gap for "main menu" feel
            const yOffset = Math.sign(distance) * (absDistance * 90 + (absDistance > 1 ? 20 : 0));

            return (
              <motion.button
                key={tab.id}
                onClick={() => scrollTo(tab.section)}
                className="w-full flex items-center gap-6 text-4xl lg:text-5xl xl:text-6xl font-gochi text-left transition-all duration-500 absolute whitespace-nowrap"
                style={{ 
                  fontFamily: '"Gochi Hand", cursive',
                  top: '50%',
                  marginTop: '-32px', // Adjusted for larger text
                  transformOrigin: 'left center',
                }}
                initial={false}
                animate={{
                  y: `${yOffset}px`,
                  opacity: isActive ? 1 : Math.max(0.15, 0.7 - absDistance * 0.25),
                  scale: isActive ? 1.15 : Math.max(0.6, 1 - absDistance * 0.15),
                  filter: isActive ? 'blur(0px)' : `blur(${absDistance * 2}px)`,
                  rotateX: distance * -25,
                  rotateY: distance * -8,
                  color: isActive ? '#0055FF' : '#4b5563', // royal vs ink-muted
                  zIndex: isActive ? 10 : 10 - absDistance,
                }}
              >
                {isActive && (
                  <motion.span 
                    layoutId="arrow-desktop"
                    className="absolute -left-12 lg:-left-16 text-royal font-mono text-3xl lg:text-4xl"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    -&gt;
                  </motion.span>
                )}
                <span className="block drop-shadow-sm">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}

