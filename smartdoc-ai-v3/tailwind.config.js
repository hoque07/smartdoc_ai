/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#05070D',
        charcoal: '#0B1020',
        ink: '#10182D',
        royal: '#2F7BFF',
        skyglow: '#75D7FF',
        pearl: '#F7FAFF',
        muted: '#9CA8BD',
        gold: '#D6B66B'
      },
      boxShadow: {
        glow: '0 0 35px rgba(47, 123, 255, 0.35)',
        gold: '0 0 28px rgba(214, 182, 107, 0.25)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial']
      }
    },
  },
  plugins: [],
};
