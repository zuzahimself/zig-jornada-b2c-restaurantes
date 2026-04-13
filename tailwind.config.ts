import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Fraunces"', 'serif'],
      },
      colors: {
        'brand-fill': 'var(--color-brand-fill)',
        'brand-fill-hover': 'var(--color-brand-fill-hover)',
        'brand-text': 'var(--color-brand-text)',
        'brand-subtle': 'var(--color-brand-subtle)',
        'brand-border': 'var(--color-brand-border)',
        'on-brand': 'var(--color-on-brand-fill)',
        'txt-primary': 'var(--color-text-primary)',
        'txt-secondary': 'var(--color-text-secondary)',
        'txt-tertiary': 'var(--color-text-tertiary)',
        'loyalty-gold': 'var(--color-loyalty-gold)',
        surface: '#ffffff',
        'surface-low': '#f5f5f7',
        border: '#ececee',
        'icon-default': '#171719',
        'icon-lowest': '#b7b6bf',
        'icon-success': '#00c67f',
        'icon-danger': '#f53c5a',
      },
      borderRadius: {
        pill: '500px',
        sm: '8px',
        md: '16px',
      },
      spacing: {
        '1x': '4px',
        '2x': '8px',
        '3x': '12px',
        '4x': '16px',
      },
      boxShadow: {
        'bottom-bar': '0 -1px 0 0 #ececee, 0 -4px 16px 0 rgba(0,0,0,0.04)',
        card: '0 2px 12px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config
