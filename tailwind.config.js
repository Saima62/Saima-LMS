/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1E2A33',        // deep navy-charcoal for headings
        paper: '#FAF7F1',      // warm off-white background
        academy: {
          50: '#F4F1EA',
          100: '#EDE6D8',
          600: '#5C6B57',       // muted sage-olive accent
          700: '#495242'
        },
        gold: '#B08D57'         // understated brass/gold accent, used sparingly
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
