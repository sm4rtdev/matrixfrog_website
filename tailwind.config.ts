/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          'matrix-green': 'var(--matrix-green)',
          'matrix-green-dark': 'var(--matrix-green-dark)',
          'matrix-black': 'var(--matrix-black)',
          'matrix-blue': 'var(--matrix-blue)',
          'matrix-red': 'var(--matrix-red)',
        },
        animation: {
          'flicker': 'flicker 8s infinite',
          'blink': 'blink 1s step-end infinite',
          'scan': 'scan 1s linear infinite',
          'fadeIn': 'fadeIn 0.5s ease-in-out forwards',
          'glitch': 'glitch 4s infinite linear alternate-reverse',
          'vibrate': 'vibrate 0.3s linear infinite',
          'loading-progress': 'matrix-loading 3s linear forwards',
        },
        boxShadow: {
          'glow-green': '0 0 10px 0 rgba(0, 255, 65, 0.5), 0 0 20px 0 rgba(0, 255, 65, 0.3)',
        },
      },
    },
    plugins: [],
  }