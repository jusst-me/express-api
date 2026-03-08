import node from 'eslint-config-jvd/node';

export default [{ ignores: ['dist/**', 'eslint.config.mjs', '.husky/**'] }, ...node];
