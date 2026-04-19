'use client';

import { useEffect, useState } from 'react';

interface ScribbleIconProps {
  children: React.ReactNode;
  label: string;
  delay?: number;
}

export default function ScribbleIcon({ children, label, delay = 0 }: ScribbleIconProps) {

  return (
    <div
      className="flex flex-col items-center group cursor-pointer w-20 sm:w-24 gap-3 transition-all duration-300 hover:-translate-y-1.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-eggshell border-2 border-royal/20 group-hover:border-royal rounded-xl group-hover:shadow-[4px_4px_0px_0px_#0055FF] transition-all duration-300">
        {/* Subtle grid pattern background for the icon container */}
        <div 
          className="absolute inset-0 opacity-[0.03] z-0 rounded-xl overflow-hidden pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#0055FF 1px, transparent 1px)', backgroundSize: '6px 6px' }}
        ></div>

        <div className="relative z-10 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {children}
        </div>
      </div>
      
      {/* Label */}
      <span
        className="text-xs text-ink-muted group-hover:text-ink font-bold font-mono text-center leading-tight transition-colors"
        style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.7rem' }}
      >
        {label}
      </span>
    </div>
  );
}
