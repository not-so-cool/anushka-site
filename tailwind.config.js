/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: 'rgb(var(--ivory) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        'paper-deep': 'rgb(var(--paper-deep) / <alpha-value>)',
        charcoal: 'rgb(var(--charcoal) / <alpha-value>)',
        'charcoal-soft': 'rgb(var(--charcoal-soft) / <alpha-value>)',
        clay: 'rgb(var(--clay) / <alpha-value>)',
        sage: 'rgb(var(--sage) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Instrument Serif"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', '"DM Sans"', 'system-ui', 'sans-serif'],
        hand: ['Caveat', '"Segoe Script"', 'cursive'],
      },
      fontSize: {
        mega: ['clamp(7rem, 34vw, 32rem)', { lineHeight: '0.82', letterSpacing: '-0.04em' }],
        display: ['clamp(3.25rem, 13vw, 12rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        title: ['clamp(2.5rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.015em' }],
        lead: ['clamp(1.4rem, 2.8vw, 2.5rem)', { lineHeight: '1.2' }],
        letter: ['clamp(1.25rem, 2.1vw, 1.85rem)', { lineHeight: '1.45' }],
        body: ['clamp(1rem, 1.3vw, 1.2rem)', { lineHeight: '1.6' }],
        note: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.16em' }],
        hand: ['clamp(1.15rem, 1.7vw, 1.55rem)', { lineHeight: '1.1' }],
      },
      spacing: {
        gutter: 'var(--gutter)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
