module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-underscore-dangle': ['off', { allow: ['id'] }],
    'linebreak-style': 0,
    'object-curly-spacing': 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    'consistent-return': 'off',
    'func-names': 'off',
    'arrow-body-style': 'off',
    'no-unused-expressions': 'off',
  },
};
