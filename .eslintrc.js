module.exports = {
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module', // Обязательно укажите, что вы используете синтаксис модулей ES6
  },
  plugins: ['react', 'node'],
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
