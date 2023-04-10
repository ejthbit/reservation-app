// vite.config.js
import { defineConfig } from "file:///Users/8bit/Desktop/React/reservation-app/node_modules/vite/dist/node/index.js";
import react from "file:///Users/8bit/Desktop/React/reservation-app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import eslint from "file:///Users/8bit/Desktop/React/reservation-app/node_modules/vite-plugin-eslint/dist/index.mjs";
import federation from "file:///Users/8bit/Desktop/React/reservation-app/node_modules/@originjs/vite-plugin-federation/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    eslint(),
    federation({
      name: "reservation-app",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Reservation/ReservationButton/ReservationButton.jsx",
        "./ReservationDialog": "./src/components/Reservation/ReservationDialog/ReservationDialog.jsx",
        "./ProtectedRoute": "./src/components/common/ProtectedRoute.jsx",
        "./AdministrationPage": "./src/components/Administration/AdministrationPage.jsx",
        "./Login": "./src/components/Login/Login.jsx",
        "./ReservationProvider": "./src/store/ReservationProvider.jsx",
        "./AnnouncementsList": "./src/components/common/AnnouncementsList.jsx"
      },
      remotes: {
        app: {
          external: `http://127.0.0.1:5001/assets/app.js`,
          from: "vite",
          externalType: "url"
        }
      },
      shared: ["react", "react-dom", "react-router-dom"]
    })
  ],
  preview: {
    host: "127.0.0.1",
    port: 5e3,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 3003,
    host: "localhost"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvOGJpdC9EZXNrdG9wL1JlYWN0L3Jlc2VydmF0aW9uLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzLzhiaXQvRGVza3RvcC9SZWFjdC9yZXNlcnZhdGlvbi1hcHAvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzLzhiaXQvRGVza3RvcC9SZWFjdC9yZXNlcnZhdGlvbi1hcHAvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGVzbGludCBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnXG5pbXBvcnQgZmVkZXJhdGlvbiBmcm9tICdAb3JpZ2luanMvdml0ZS1wbHVnaW4tZmVkZXJhdGlvbidcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW1xuICAgICAgICByZWFjdCgpLFxuICAgICAgICBlc2xpbnQoKSxcbiAgICAgICAgZmVkZXJhdGlvbih7XG4gICAgICAgICAgICBuYW1lOiAncmVzZXJ2YXRpb24tYXBwJyxcbiAgICAgICAgICAgIGZpbGVuYW1lOiAncmVtb3RlRW50cnkuanMnLFxuICAgICAgICAgICAgZXhwb3Nlczoge1xuICAgICAgICAgICAgICAgICcuL0J1dHRvbic6ICcuL3NyYy9jb21wb25lbnRzL1Jlc2VydmF0aW9uL1Jlc2VydmF0aW9uQnV0dG9uL1Jlc2VydmF0aW9uQnV0dG9uLmpzeCcsXG4gICAgICAgICAgICAgICAgJy4vUmVzZXJ2YXRpb25EaWFsb2cnOiAnLi9zcmMvY29tcG9uZW50cy9SZXNlcnZhdGlvbi9SZXNlcnZhdGlvbkRpYWxvZy9SZXNlcnZhdGlvbkRpYWxvZy5qc3gnLFxuICAgICAgICAgICAgICAgICcuL1Byb3RlY3RlZFJvdXRlJzogJy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL1Byb3RlY3RlZFJvdXRlLmpzeCcsXG4gICAgICAgICAgICAgICAgJy4vQWRtaW5pc3RyYXRpb25QYWdlJzogJy4vc3JjL2NvbXBvbmVudHMvQWRtaW5pc3RyYXRpb24vQWRtaW5pc3RyYXRpb25QYWdlLmpzeCcsXG4gICAgICAgICAgICAgICAgJy4vTG9naW4nOiAnLi9zcmMvY29tcG9uZW50cy9Mb2dpbi9Mb2dpbi5qc3gnLFxuICAgICAgICAgICAgICAgICcuL1Jlc2VydmF0aW9uUHJvdmlkZXInOiAnLi9zcmMvc3RvcmUvUmVzZXJ2YXRpb25Qcm92aWRlci5qc3gnLFxuICAgICAgICAgICAgICAgICcuL0Fubm91bmNlbWVudHNMaXN0JzogJy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL0Fubm91bmNlbWVudHNMaXN0LmpzeCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3Rlczoge1xuICAgICAgICAgICAgICAgIGFwcDoge1xuICAgICAgICAgICAgICAgICAgICBleHRlcm5hbDogYGh0dHA6Ly8xMjcuMC4wLjE6NTAwMS9hc3NldHMvYXBwLmpzYCxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogJ3ZpdGUnLFxuICAgICAgICAgICAgICAgICAgICBleHRlcm5hbFR5cGU6ICd1cmwnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hhcmVkOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgIH0pLFxuICAgIF0sXG4gICAgcHJldmlldzoge1xuICAgICAgICBob3N0OiAnMTI3LjAuMC4xJyxcbiAgICAgICAgcG9ydDogNTAwMCxcbiAgICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgICAgIG1pbmlmeTogZmFsc2UsXG4gICAgICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgcG9ydDogMzAwMyxcbiAgICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZTLFNBQVMsb0JBQW9CO0FBQzFVLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsV0FBVztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsU0FBUztBQUFBLFFBQ0wsWUFBWTtBQUFBLFFBQ1osdUJBQXVCO0FBQUEsUUFDdkIsb0JBQW9CO0FBQUEsUUFDcEIsd0JBQXdCO0FBQUEsUUFDeEIsV0FBVztBQUFBLFFBQ1gseUJBQXlCO0FBQUEsUUFDekIsdUJBQXVCO0FBQUEsTUFDM0I7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNMLEtBQUs7QUFBQSxVQUNELFVBQVU7QUFBQSxVQUNWLE1BQU07QUFBQSxVQUNOLGNBQWM7QUFBQSxRQUNsQjtBQUFBLE1BQ0o7QUFBQSxNQUNBLFFBQVEsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsSUFDckQsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNMLCtCQUErQjtBQUFBLElBQ25DO0FBQUEsRUFDSjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsY0FBYztBQUFBLEVBQ2xCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDVjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
