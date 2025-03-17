import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import dts from 'vite-plugin-dts'
import tsConfigPaths from 'vite-tsconfig-paths'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [
        react(),
        eslint(),
        tsConfigPaths(),
        dts({ tsconfigPath: './tsconfig.json', rollupTypes: true }),
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
        manifest: true,
        minify: false,
        reportCompressedSize: true,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: '@ejthbit/reservation-app',
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['react', 'react-dom'],
            output: {
                generatedCode: 'es2015',
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
        sourcemap: true,
        // Clears the output directory before building.
        emptyOutDir: true,
    },
    server: {
        port: 3003,
        host: 'localhost',
    },
})
