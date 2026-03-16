/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        surface: '#FFFFFF',
        primary: '#EAC8B9', // Soft pastel pink/beige button color
        primaryHover: '#DFAA9D',
        textMain: '#4A4A4A',
        textLight: '#7A7A7A',
        cardBeige: '#F1E9E4', // Resin card background
        cardGreen: '#E0E7E2', // Bloom card background
        cardBrown: '#DFD1CB', // Mind soul card
        cardDarkBeige: '#DCCFC6', // Lippan card
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'minimal': '0 2px 10px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
