/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Electric blue-violet — tuned to the logo's "S" accent.
        brand: {
          50: '#eef1ff',
          100: '#e0e5ff',
          200: '#c6ceff',
          300: '#a3adff',
          400: '#7c86ff',
          500: '#5b63f5',
          600: '#4b4fe6',
          700: '#3d3fc4',
          800: '#33339e',
          900: '#2d2f7d',
        },
        // Charcoal / near-black used in the logo background and dark hero.
        ink: {
          800: '#1a1c24',
          900: '#121319',
          950: '#0b0c11',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.15s ease-out',
        scaleIn: 'scaleIn 0.15s ease-out',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
}
