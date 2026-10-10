module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        paper: '#EDE6D6',
        'paper-card': '#F6F1E7',
        'ink-black': '#1A1816',
        'petrol-dark': '#0A5560',
        'petrol-light': '#166E7A',
        'stamp-red': '#E8472B',
        'stamp-dim': '#F9EDE9',
        tape: 'rgba(235, 222, 185, 0.85)',
      },
      fontFamily: {
        slab: ['Bevan', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      borderWidth: { 3: '3px', 5: '5px' },
    },
  },
};
