// Skip Husky install in production and CI (official Husky approach)
// https://typicode.github.io/husky/how-to.html#ci-server-and-docker
// HUSKY=0 is the official way to disable; CI is commonly set in CI/Docker
const isProdOrCI =
  process.env.NODE_ENV === 'production' || process.env.CI || process.env.HUSKY === '0';

if (!isProdOrCI) {
  try {
    const husky = (await import('husky')).default;
    console.info(husky());
  } catch (e) {
    // Husky not installed (e.g. pnpm install --prod)
    if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ERR_MODULE_NOT_FOUND') {
      throw e;
    }
  }
}
