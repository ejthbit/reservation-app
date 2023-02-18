import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import federation from '@originjs/vite-plugin-federation'
export default defineConfig({
    plugins: [
        react(),
        eslint(),
        federation({
            name: 'reservation-app',
            filename: 'remoteEntry.js',
            exposes: {
                './Button': './src/components/Reservation/ReservationButton/ReservationButton.jsx',
                './ReservationDialog': './src/components/Reservation/ReservationDialog/ReservationDialog.jsx',
            },
            remotes: {
                app: {
                    external: `http://127.0.0.1:5001/assets/app.js`,
                    from: 'vite',
                    externalType: 'url',
                },
            },
            shared: {
                react: { singleton: true, requiredVersion: '*' },
            },
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
