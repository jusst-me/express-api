/**
 * Registers tsconfig path aliases for the compiled output.
 * Use with: node -r ./scripts/register-paths.js dist/index.js
 */
require('tsconfig-paths').register({
  baseUrl: './dist',
  paths: { '@/*': ['./*'] },
});
