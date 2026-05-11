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
        // [LOCAL TESTING] Uncomment the proxy block below to forward Trino API
        // requests to a local Trino instance running on port 8080.
        // proxy: {
        //     '/v1': {
        //         target: 'http://localhost:8080',
        //         changeOrigin: true,
        //         secure: false,
        //         configure: (proxy) => {
        //             proxy.on('proxyRes', (proxyRes) => {
        //                 delete proxyRes.headers['www-authenticate'];
        //             });
        //         },
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
