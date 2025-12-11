import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@components': path.resolve(__dirname, './src/components'),
          '@features': path.resolve(__dirname, './src/features'),
          '@services': path.resolve(__dirname, './src/services'),
          '@hooks': path.resolve(__dirname, './src/hooks'),
          '@utils': path.resolve(__dirname, './src/utils'),
          '@types': path.resolve(__dirname, './src/types'),
          '@config': path.resolve(__dirname, './src/config'),
          '@assets': path.resolve(__dirname, './src/assets'),
          '@store': path.resolve(__dirname, './src/store'),
          '@layouts': path.resolve(__dirname, './src/layouts'),
          '@pages': path.resolve(__dirname, './src/pages'),
          '@shared': path.resolve(__dirname, './shared'),
        }
      }
    };
});
