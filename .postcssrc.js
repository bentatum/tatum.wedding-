var postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    postcssPresetEnv({
      stage: 0,
      importFrom: [
        {
          /**
           * Since we're unable to use var(--cl-breakpoints--x) inside of a media query,
           * we're using env(--cl-breakpoints--x) instead.
           * https://preset-env.cssdb.org/features#environment-variables
           * https://drafts.csswg.org/css-env-1/
           */
          environmentVariables: {
            '--cl-breakpoints--xs': '320px',
            '--cl-breakpoints--sm': '768px',
            '--cl-breakpoints--md': '1024px',
            '--cl-breakpoints--lg': '1440px',
            '--cl-breakpoints--xl': '2560px'
          }
        }
      ]
    })
  ]
};
