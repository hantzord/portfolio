/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        eggshell: '#F9F9F7',
        manila: '#F5E6C4',
        'manila-dark': '#E8D3A2',
        royal: '#0055FF',
        ink: '#111111',
        'royal-light': '#EEF3FF',
        'royal-pale': '#D6E4FF',
        'ink-muted': '#555555',
      },
      fontFamily: {
        gochi: ['"Gochi Hand"', 'cursive'],
        mono: ['"DM Mono"', 'monospace'],
        sans: ['Figtree', 'sans-serif'],
      },
      keyframes: {
        'scribble-in': {
          '0%': { strokeDashoffset: '400', opacity: '0' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
        'float-up': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'grain': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '30%': { transform: 'translate(3%, 2%)' },
          '50%': { transform: 'translate(-1%, 4%)' },
          '70%': { transform: 'translate(4%, -1%)' },
          '90%': { transform: 'translate(-3%, 1%)' },
        },
      },
      animation: {
        'scribble-in': 'scribble-in 0.8s ease-out forwards',
        'float-up': 'float-up 3s ease-in-out infinite',
        'fade-slide-up': 'fade-slide-up 0.6s ease-out forwards',
        'grain': 'grain 0.5s steps(1) infinite',
      },
    },
  },
  plugins: [],
};
