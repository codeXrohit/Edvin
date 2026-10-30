/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files: ['./index.html', './src/**/*.{js,jsx}'],
  },
  theme: {
    extend: {
      screens: {
        'tablet-down': {
          raw: '(max-width: 1100px)',
        },
        'phone-down': {
          raw: '(max-width: 767px)',
        },
        'small-phone': {
          raw: '(max-width: 359px)',
        },
        'tablet-landscape': {
          raw: '(max-width: 1100px) and (min-width: 768px)',
        },
        'short-desktop': {
          raw: '(max-height: 720px) and (min-width: 768px)',
        },
        'short-phone': {
          raw: '(max-height: 740px) and (max-width: 767px)',
        },
        'compact-desktop': {
          raw: '(max-height: 560px) and (min-width: 768px)',
        },
        'portrait-tablet': {
          raw: '(min-width: 768px) and (max-width: 1000px) and (orientation: portrait)',
        },
        'contact-tablet': {
          raw: '(max-width: 860px)',
        },
        'contact-phone': {
          raw: '(max-width: 640px)',
        },
        'landscape-phone': {
          raw: '(max-width: 767px) and (max-height: 500px)',
        },
      },
      keyframes: {
        'contact-spin': {
          to: {
            transform: 'rotate(360deg)',
          },
        },
        'wave-drift': {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(-120px)',
          },
        },
        'cloud-drift': {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(160px)',
          },
        },
        cue: {
          '0%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '70%': {
            transform: 'translateY(14px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '0',
          },
        },
        'truck-road': {
          to: {
            backgroundPosition: '-60px 0',
          },
        },
        'truck-bob': {
          '0%,100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-.4px)',
          },
        },
      },
      animation: {
        'wave-drift': 'wave-drift 6s linear infinite',
        'wave-drift-slow': 'wave-drift 11s linear infinite reverse',
        'cloud-drift': 'cloud-drift 40s linear infinite alternate',
        'truck-road': 'truck-road .8s linear infinite',
        'truck-bob': 'truck-bob .6s ease-in-out infinite',
      },
      colors: {
        navy: '#1D3045',
        ink: '#14233A',
        paper: '#F5F9FC',
        sky: '#DCEFFB',
        sea: '#2C7DA0',
        toyred: '#E4572E',
        sun: '#F6B93B',
        leaf: '#3BA272',
        teal: '#1F9E9A',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['"Nunito Variable"', 'Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '7xl': '1400px',
      },
    },
  },
  plugins: [],
};
