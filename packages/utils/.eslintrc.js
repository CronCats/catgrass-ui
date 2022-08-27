// @ts-check

/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  extends: [require.resolve('@croncat-ui/config/eslint')],
  ignorePatterns: ['node_modules'],
  root: true,
}

module.exports = eslintConfig
