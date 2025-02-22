import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        merriweather: ['var(--font-merriweather)', 'serif'],
        quicksand: ['var(--font-quicksand)', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: '#1A1A1A',
          orange: '#FF6B3D',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        'sm': '0.375rem',
        'lg': '0.75rem',
        story: '32px',
      },
      fontSize: {
        '4xl': ['48px', {
          lineHeight: '56px',
          letterSpacing: '0%',
        }],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addBase }) {
      addBase({
        ':root': {
          '--background': '30 91% 95%',      // #FFF5EC - Exact cream background from Figma
          '--foreground': '24 100% 15%',     // #4F2400 - Brown text
          '--primary': '217 91% 60%',
          '--primary-foreground': '24 100% 15%', // #4F2400 - Same as foreground
          '--muted': '220 14% 96%',
          '--muted-foreground': '220 9% 46%',
          '--border': '27 31% 86%',
          '--input': '28 61% 91%',
          '--ring': '224 71% 4%',

          // Fallback values
          '--background-fallback': `rgb(255, 245, 236)`,
          '--foreground-fallback': `rgb(26, 26, 26)`,
          '--primary-fallback': `rgb(59, 130, 246)`,
          '--primary-foreground-fallback': `rgb(79, 36, 0)`,
          '--muted-fallback': `rgb(243, 244, 246)`,
          '--muted-foreground-fallback': `rgb(107, 114, 128)`,
          '--accent-fallback': `rgb(59, 130, 246)`,
          '--accent-foreground-fallback': `rgb(255, 255, 255)`,
          '--border-fallback': `rgb(50, 50, 50)`,
          '--input-fallback': `rgb(229, 231, 235)`,
          '--ring-fallback': `rgb(26, 32, 56)`,
        },
      });
    }),
  ],
};

export default config; 