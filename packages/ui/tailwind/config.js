const defaultTheme = require('tailwindcss/defaultTheme')

const { animation } = require('./animation')
const { backgroundColor, borderColor, colors, textColor } = require('./colors')
const { keyframes } = require('./keyframes')

/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  darkMode: 'class',
  options: {
    safelist: [/data-theme$/],
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/line-clamp'),
    require('./button'),
    require('@tailwindcss/typography'),
  ],
  theme: {
    screens: {
      // xs: '416px',
      // '2xs': '0px',
      xs: { min: '0px', max: '639px' },
      ...defaultTheme.screens,
    },
    extend: {
      backgroundImage: {
        'gradient-radial-t': `radial-gradient(ellipse at top, var(--tw-gradient-stops))`,
        'gradient-radial': `radial-gradient(ellipse, var(--tw-gradient-stops))`,
        'gradient-radial-t-wide': `radial-gradient(80% 50% at top, var(--tw-gradient-stops))`,
        'gradient-test': `linear-gradient(270deg, #06090B 0%, rgba(6, 9, 11, 0) 49.62%, rgba(6, 9, 11, 0) 51.87%, #06090B 100%)`,
      },
      boxShadow: {
        slider: '0 0 0 5px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        mono: ['Space Mono', ...defaultTheme.fontFamily.mono],
        sans: ['inter', ...defaultTheme.fontFamily.sans],
      },
      animation,
      backgroundColor,
      borderColor,
      colors,
      keyframes,
      textColor,
    },
  },

  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: [],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
    darkTheme: 'dark',
  },
}

module.exports = tailwindConfig
