const eslintConfig = {
  extends: [require.resolve('@croncat-ui/config/eslint')],
  ignorePatterns: ['.next', '.turbo', 'node_modules', 'out', 'next-env.d.ts'],
  root: true,
  // plugins: ['header'],
  // rules: {
  //   'header/header': [
  //     'error',
  //     'line',
  //     '',
  //     1,
  //   ],
  // },
}

module.exports = eslintConfig
