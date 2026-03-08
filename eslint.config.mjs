import node from 'eslint-config-jvd/node';

export default [
  {
    ignores: ['dist/**', 'eslint.config.mjs', '.husky/**', 'jest.config.js', 'scripts/**'],
  },
  ...node,
];
