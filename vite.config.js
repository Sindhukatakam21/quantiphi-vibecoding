import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  // Vitest only runs the React UI tests; logic tests use node:test.
  test: { include: ['tests/**/*.ui.test.jsx'] },
});
