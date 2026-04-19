'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageSrc?: string;
  videoSrc?: string;
  slides?: string[]; // New prop for PDF-style slides
  pdfUrl?: string;   // New prop for the PDF file
  liveUrl?: string;
  githubUrl?: string;
  index: number;
}

// Hand-drawn irregular border SVG overlay that scales perfectly to any aspect ratio
function ScribbleBorder({ color = '#0055FF', strokeWidth = 3 }: { color?: string; strokeWidth?: number }) {
  return (
    <svg
      className="absolute -inset-[2px] w-[calc(100%+4px)] h-[calc(100%+4px)] pointer-events-none z-20"
      preserveAspectRatio="none"
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10,10 
           C 250,5 500,15 750,10 C 850,5 950,12 990,10 
           C 995,250 985,500 990,750 C 995,850 988,950 990,990 
           C 750,995 500,985 250,990 C 150,995 50,988 10,990 
           C 5,750 15,500 10,250 C 5,150 12,50 10,10 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function ProjectCard({
  title,
  description,
  tags,
  imageSrc,
  videoSrc,
  slides,
  pdfUrl,
  liveUrl,
  githubUrl,
  index,
}: ProjectCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'image' | 'video' | 'slides'>('image');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalOpen || modalContent !== 'slides' || !slides) return;
      if (e.key === 'ArrowRight') nextSlide(e as any);
      if (e.key === 'ArrowLeft') prevSlide(e as any);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, modalContent, slides, currentSlide]); // currentSlide included to ensure nextSlide/prevSlide have fresh state if needed, though they use functional updates

  const openModal = (type: 'image' | 'video' | 'slides') => {
    setModalContent(type);
    setModalOpen(true);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides) {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slides) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-20 md:mb-28 p-6 md:p-10 bg-white/20 rounded-2xl"
      >
        <ScribbleBorder color="#0055FF" strokeWidth={5} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
          {/* Left – Screenshot / Slides */}
          <div 
            className="relative cursor-zoom-in group" 
            style={{ minHeight: 200 }}
            onClick={() => slides ? openModal('slides') : imageSrc && openModal('image')}
          >
            <div className="relative w-full h-full aspect-video rounded-sm overflow-hidden shadow-md bg-eggshell">
              {slides ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={slides[currentSlide]}
                        alt={`${title} slide ${currentSlide + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Progress Bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-royal/10 z-30">
                    <motion.div 
                      className="h-full bg-royal"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  
                  {/* Slide Controls */}
                  <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={prevSlide}
                      className="w-8 h-8 rounded-full bg-white/90 border border-royal text-royal flex items-center justify-center hover:bg-royal hover:text-white transition-colors"
                    >
                      ←
                    </button>
                    <div className="px-3 py-1 bg-white/90 border border-royal rounded-full text-[10px] font-mono text-royal flex items-center">
                      {currentSlide + 1} / {slides.length}
                    </div>
                    <button 
                      onClick={nextSlide}
                      className="w-8 h-8 rounded-full bg-white/90 border border-royal text-royal flex items-center justify-center hover:bg-royal hover:text-white transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>
              ) : imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={`${title} screenshot`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : null}
            </div>
            <ScribbleBorder strokeWidth={2.5} />
            
            {/* Visual Affordance: Subtle Expand Icon */}
            <div className="absolute top-3 right-3 z-30 pointer-events-none transition-opacity duration-300 bg-white/90 backdrop-blur-sm p-1.5 rounded-md border border-royal/20 text-royal shadow-sm opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-royal group-hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            </div>

            {/* Visual Affordance: Gallery Dots for Slides */}
            {slides && (
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-30 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-royal shadow-[0_0_2px_rgba(255,255,255,0.8)]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-royal/40 shadow-[0_0_2px_rgba(255,255,255,0.8)]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-royal/40 shadow-[0_0_2px_rgba(255,255,255,0.8)]"></div>
              </div>
            )}
          </div>

          {/* Right – Video / Info */}
          <div className="flex flex-col gap-4">
            {/* Video or fallback - only show if videoSrc exists */}
            {videoSrc && (
              <div 
                className="relative flex-shrink-0 cursor-zoom-in group" 
                style={{ minHeight: 160 }}
                onClick={() => openModal('video')}
              >
                <div className="relative w-full h-full aspect-video rounded-sm overflow-hidden shadow-md">
                  <video
                    src={videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <ScribbleBorder color="#0055FF" strokeWidth={2.5} />

                {/* Visual Affordance: Subtle Expand Icon for Video */}
                <div className="absolute top-3 right-3 z-30 pointer-events-none transition-opacity duration-300 bg-white/90 backdrop-blur-sm p-1.5 rounded-md border border-royal/20 text-royal shadow-sm opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-royal group-hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-col gap-2">
              <h3
                className="text-2xl font-gochi text-ink leading-tight"
                style={{ fontFamily: '"Gochi Hand", cursive' }}
              >
                {title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">{description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2 py-0.5 border border-royal text-royal rounded-sm bg-white shadow-sm"
                    style={{ fontFamily: '"DM Mono", monospace' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4 mt-2">
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-scribble text-sm border-royal text-royal"
                    style={{ background: 'rgba(0, 85, 255, 0.05)' }}
                  >
                    View PDF Document 📄
                  </a>
                )}
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-scribble text-sm"
                  >
                    Live Demo ↗
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-github"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-ink/60 backdrop-blur-md"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col bg-eggshell rounded-xl overflow-hidden shadow-2xl border-2 border-royal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[110] w-10 h-10 flex items-center justify-center bg-white border-2 border-royal rounded-full text-royal hover:bg-royal hover:text-white transition-colors shadow-md"
                onClick={() => setModalOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Main Media Content */}
              <div className="relative w-full flex-1 min-h-[40vh] sm:min-h-[60vh] bg-[#e6e5e1] flex flex-col items-center justify-center overflow-hidden">
                {modalContent === 'slides' && slides ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 p-2 sm:p-8 flex items-center justify-center"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={slides[currentSlide]}
                            alt={`${title} slide ${currentSlide + 1}`}
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* Progress Bar (Top) */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-royal/10 z-[120]">
                      <motion.div 
                        className="h-full bg-royal shadow-[0_0_10px_rgba(0,85,255,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>

                    {/* Invisible Touch Zones for Mobile Swiping (Left/Right edges) */}
                    <div className="absolute inset-y-0 left-0 w-1/3 z-[100] cursor-pointer" onClick={prevSlide} />
                    <div className="absolute inset-y-0 right-0 w-1/3 z-[100] cursor-pointer" onClick={nextSlide} />
                  </>
                ) : modalContent === 'image' && imageSrc ? (
                  <div className="absolute inset-0 p-2 sm:p-8">
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <video
                    src={videoSrc}
                    autoPlay
                    muted
                    controls
                    loop
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                  />
                )}
              </div>
              
              {/* Modal Footer / Controls */}
              <div className="bg-white border-t-2 border-royal flex flex-col sm:flex-row items-center justify-between p-4 sm:px-6 sm:py-4 gap-4">
                <div className="text-center sm:text-left w-full sm:w-auto">
                  <h4 className="font-gochi text-2xl text-royal line-clamp-1" style={{ fontFamily: '"Gochi Hand", cursive' }}>{title}</h4>
                  <p className="text-ink-muted text-xs sm:text-sm font-mono mt-1" style={{ fontFamily: '"DM Mono", monospace' }}>
                    {modalContent === 'slides' ? 'Project Presentation (PPT)' : modalContent === 'image' ? 'Screenshot Preview' : 'Video Demonstration'}
                  </p>
                </div>

                {/* Slide Controls in Footer */}
                {modalContent === 'slides' && slides && (
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center">
                    <button 
                      onClick={prevSlide}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-eggshell border-2 border-royal text-royal flex items-center justify-center hover:bg-royal hover:text-white transition-all shadow-[2px_2px_0px_0px_#0055FF] active:translate-y-1 active:shadow-none"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="px-4 sm:px-6 py-1.5 sm:py-2 bg-eggshell border-2 border-royal rounded-full text-xs sm:text-sm font-mono text-royal flex items-center whitespace-nowrap shadow-[2px_2px_0px_0px_#0055FF] font-bold">
                      {currentSlide + 1} / {slides.length}
                    </div>
                    <button 
                      onClick={nextSlide}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-eggshell border-2 border-royal text-royal flex items-center justify-center hover:bg-royal hover:text-white transition-all shadow-[2px_2px_0px_0px_#0055FF] active:translate-y-1 active:shadow-none"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
