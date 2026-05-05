import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#FF7607',
        'brand-blue': '#1D4ED8',
        'brand-green': '#0E7C4A',
        'brand-purple': '#7C3AED',
        'brand-yellow': '#B45309',
        'bg-light': '#FAFAF8',
        'bg-dark': '#1A1A1A',
        'text-dark': '#2D2D2D',
        'text-light': '#F5F5F0',
        'border-light': '#E5E5E0',
        'border-dark': '#333333',
      },
      spacing: {
        'density-compact': '32px',
        'density-balanced': '38px',
        'density-comfortable': '48px',
      },
    },
  },
  plugins: [],
}
export default config
