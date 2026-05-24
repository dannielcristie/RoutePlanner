import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  minify: true,
  clean: true,
  noExternal: [/(.*)/], // Bundles all node_modules into the final output
});
