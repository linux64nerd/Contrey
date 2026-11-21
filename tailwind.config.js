/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Notion Palette
        'notion-blue': '#0075de',
        'notion-canvas': '#f6f5f4',
        'notion-white': '#ffffff',
        'notion-black': '#000000',
        'notion-charcoal': '#111111',
        'notion-stone': '#757575',
        'notion-graphite': '#615d59',
        'notion-slate': '#696969',
        'notion-sky-tint': '#e6f3fe',
        'notion-marigold': '#ffb110',
        'notion-coral': '#f64932',
        'notion-saffron': '#e89d01',
        'notion-vermillion': '#e32d14',
        'notion-mocha': '#b18164',
        'notion-signal-blue': '#097fe8',
        'notion-sky-wash': '#62aef0',
        'notion-midnight': '#02093a',
        'notion-peach': '#f6d5b8',
        'notion-border': 'rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['NotionInter', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lyon Text', 'Source Serif 4', 'Georgia', 'serif'],
      },
      borderRadius: {
        'notion-card': '12px',
        'notion-btn': '8px',
        'notion-sm': '4px',
        'notion-pill': '9999px',
      },
      boxShadow: {
        'notion-nav': '0px 0.7px 1.462px 0px rgba(0, 0, 0, 0.015), 0px 3px 9px 0px rgba(0, 0, 0, 0.03)',
        'notion-mockup': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'notion-subtle': '0 1px 3px rgba(0, 0, 0, 0.04)',
      },
      letterSpacing: {
        'notion-display-lg': '-4.6px',
        'notion-display': '-2.016px',
        'notion-display-sm': '-1.89px',
        'notion-heading-sm': '-0.242px',
      },
      maxWidth: {
        'notion-page': '1440px',
      }
    },
  },
  plugins: [],
}
