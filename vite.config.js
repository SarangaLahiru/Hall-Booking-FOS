
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@fortawesome/react-fontawesome': '@fortawesome/react-fontawesome',
    },
  },
  plugins: [react()],
});


