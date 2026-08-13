/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        primaryHover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
        textMain: 'rgb(var(--color-text-main) / <alpha-value>)',
        textLight: 'rgb(var(--color-text-light) / <alpha-value>)',
        cardBeige: 'rgb(var(--color-card-beige) / <alpha-value>)',
        cardGreen: 'rgb(var(--color-card-green) / <alpha-value>)',
        cardBrown: 'rgb(var(--color-card-brown) / <alpha-value>)',
        cardDarkBeige: 'rgb(var(--color-card-dark-beige) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem', /* slightly less exaggerated */
        '4xl': '1.5rem', /* slightly less exaggerated */
        'full': '9999px',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0, 0, 0, 0.03)',
        'minimal': '0 4px 20px -2px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
