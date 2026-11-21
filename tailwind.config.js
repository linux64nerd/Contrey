/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Figma Palette — Primary Action: Electric Indigo #4d49fc
        brand: {
          50: '#f3f2ff',
          100: '#ebe9fe',
          200: '#dcd8fe',
          300: '#c4baff', // Lilac
          400: '#8a85fd',
          500: '#6661fc',
          600: '#4d49fc', // Electric Indigo (Figma Hero Accent)
          700: '#3b37ea',
          800: '#2f2bc4',
          900: '#28259d',
          950: '#16145f',
        },
        indigo: {
          50: '#f3f2ff',
          100: '#ebe9fe',
          200: '#dcd8fe',
          300: '#c4baff',
          400: '#8a85fd',
          500: '#6661fc',
          600: '#4d49fc',
          700: '#3b37ea',
          800: '#2f2bc4',
          900: '#28259d',
          950: '#16145f',
        },
        // Official Figma Color Tokens
        figma: {
          black: '#000000',      // Ink Black
          white: '#ffffff',      // Paper White
          mist: '#e2e2e2',       // Soft Mist
          graphite: '#595959',   // Graphite
          indigo: '#4d49fc',     // Electric Indigo
          cyan: '#00b6ff',       // Figma Cyan
          green: '#24cb71',      // Figma Green
          orange: '#ff7237',     // Figma Orange
          lime: '#e4ff97',       // Lime Wash
          lilac: '#c4baff',      // Lilac
          blush: '#ffc9c1',      // Blush
          aqua: '#c7f8fb',       // Aqua Mist
          teal: '#33dfdf',       // Earworm Teal
          mustard: '#b98e01',    // Mustard
        },
        // Harmonize Slate to Figma Achromatic Tone Scale
        slate: {
          50: '#ffffff',   // Paper White canvas
          100: '#f7f7f7',  // Clean subtle surface
          200: '#e2e2e2',  // Soft Mist borders
          300: '#cccccc',
          400: '#8c8c8c',
          500: '#595959',  // Graphite muted text
          600: '#3d3d3d',
          700: '#262626',
          800: '#1a1a1e',  // Dark elevated panel
          850: '#141417',
          900: '#101013',  // Dark card
          950: '#0c0c0e',  // Dark canvas
        },
        surface: {
          canvas: '#ffffff',
          card: '#ffffff',
          subtle: '#f7f7f7',
          muted: '#e2e2e2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 8px 24px -4px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 16px 32px -4px rgba(15, 23, 42, 0.08)',
        'glow-brand': '0 0 24px -2px rgba(77, 73, 252, 0.35)',
        'glow-emerald': '0 0 24px -2px rgba(16, 185, 129, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      maxWidth: {
        'content': '1400px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out both',
      },
    },
  },
  plugins: [],
}
