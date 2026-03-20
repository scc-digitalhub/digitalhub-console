import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), splitVendorChunkPlugin(), tailwindcss()],
    define: {
        'process.env': process.env,
    },
    server: {
        host: true,
        // Proxies Trino API requests to Docker container(for local testing)
        // proxy: {
        //     '/v1': {
        //         target: 'http://localhost:8080',
        //         changeOrigin: true,
        //         secure: false,
        //     },
        // },
    },
    base: './',
    build: {
        manifest: true,
    },
    optimizeDeps: {
        include: ['@mui/material/Tooltip'],
        exclude: ['js-big-decimal'],
    },
});
