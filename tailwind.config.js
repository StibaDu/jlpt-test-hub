/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // V3 "washi & ink" palette — values tuned for WCAG AA (4.5:1 on paper)
        paper: '#FAF6F1',
        card: '#FFFDFA',
        ink: '#2C2620',
        sub: '#756B5C',
        line: '#EAE2D6',
        verm: '#C34531',
        vermDeep: '#B23F2B',
        vermSoft: '#F9EAE4',
        matcha: '#52755F',
        matchaSoft: '#EAF1EC',
        indigo: '#4F7698',
        indigoSoft: '#EAF0F5',
        aki: '#B35B47',
        akiSoft: '#F6ECE8',
        gold: '#846916',
        goldSoft: '#F7EFDC',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        jp: ['"Noto Sans JP Variable"', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(44,38,32,.05), 0 10px 30px -14px rgba(44,38,32,.14)',
        lift: '0 2px 6px rgba(44,38,32,.07), 0 18px 40px -16px rgba(44,38,32,.20)',
      },
      keyframes: {
        stampIn: {
          '0%': { opacity: '0', transform: 'scale(1.6) rotate(-14deg)' },
          '60%': { opacity: '1', transform: 'scale(.94) rotate(-7deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-8deg)' },
        },
      },
      animation: {
        stamp: 'stampIn .5s cubic-bezier(.34,1.56,.64,1) .2s both',
      },
    },
  },
  plugins: [],
};
