import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import federation from '@originjs/vite-plugin-federation'
export default defineConfig({
    plugins: [
        react(),
        eslint(),
        federation({
            name: 'home',
            filename: 'homepage.js',
            exposes: {
                './Button': './src/components/Reservation/ReservationButton/ReservationButton.jsx',
                './Home': './src/components/Home.jsx',
                './ReservationDialog': './src/components/Reservation/ReservationDialog/ReservationDialog.jsx',
            },
            shared: ['react'],
        }),
    ],
    preview: {
        host: '127.0.0.1',
        port: 5000,
        strictPort: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    build: {
        target: 'esnext',
        minify: false,
        cssCodeSplit: false,
    },
    server: {
        port: 3003,
        host: 'localhost',
    },
})
