import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-reactflow': ['reactflow'],
            'vendor-ui': ['framer-motion', 'lucide-react'],
            'vendor-charts': ['chart.js', 'react-chartjs-2'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    // Otimizações de produção
    ...(isProduction && {
      optimizeDeps: {
        include: ['react', 'react-dom', 'reactflow', 'framer-motion'],
      },
    }),
  };
});
