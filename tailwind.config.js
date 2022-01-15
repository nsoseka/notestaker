module.exports = {
  purge: [
    "./app/**/*.html.erb",
  ],
  darkMode: false,
  content: [],
  theme: {
    extend: {},
    letterSpacing: {
      tightest: '-.075em',
      tighter: '-.05em',
      tight: '-.025em',
      normal: '0',
      wide: '.025em',
      wider: '.05em',
      widest: '.1em',
      widest: '.25em',
      largest: '1em',
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}


//set your NODE_ENV set to production for purging when sending to production.
