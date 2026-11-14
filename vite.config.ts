import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * The security headers Netlify sends for "/*", read from netlify.toml so
 * `npm run preview` tests the real CSP. One source of truth: edit netlify.toml.
 */
function netlifyHeaders(): Record<string, string> {
  const toml = readFileSync(new URL('./netlify.toml', import.meta.url), 'utf8');
  const block = toml.split('[[headers]]').find((b) => /for\s*=\s*"\/\*"/.test(b)) ?? '';
  const headers: Record<string, string> = {};
  for (const m of block.matchAll(/^\s*([A-Za-z-]+)\s*=\s*"([^"]*)"\s*$/gm)) {
    const [, key, value] = m;
    if (key && value !== undefined && key !== 'for') headers[key] = value;
  }
  // HSTS and upgrade-insecure-requests only make sense over HTTPS; preview runs on http://localhost.
  delete headers['Strict-Transport-Security'];
  if (headers['Content-Security-Policy']) {
    headers['Content-Security-Policy'] = headers['Content-Security-Policy'].replace(/;\s*upgrade-insecure-requests/, '');
  }
  return headers;
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
  },
  // The motion engine is only imported on demand, so the dev server would otherwise
  // discover these mid-session, re-bundle, and fail that first request with a 504.
  optimizeDeps: {
    include: ['gsap', 'gsap/SplitText', 'lenis'],
  },
  preview: {
    headers: netlifyHeaders(),
  },
  ssr: {
    noExternal: ['react-helmet-async'],
  },
});
