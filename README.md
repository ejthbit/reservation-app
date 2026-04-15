# @ejthbit/reservation-app

React component library for managing medical/ambulance reservations. Published as an npm package — not a standalone app.

## Setup

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL = https://your-api-url.com/
VITE_APPOINTMENT_DURATION = '10'
VITE_RE_CAPTCHA_SITE_KEY = your-recaptcha-site-key
```

When used as an npm library, the consumer app's `.env` provides these values — Vite resolves `import.meta.env.VITE_*` at the consumer's build time.

## Commands

| Command          | Description                                       |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Start dev server (Vite, port 3003)                |
| `pnpm build`     | Production build (`tsc` + `vite build` → `dist/`) |
| `pnpm build:dev` | Development build                                 |
| `pnpm run:mfe`   | Build dev + serve via `vite preview` on port 5000 |
| `pnpm lint`      | ESLint on `src/`                                  |

## Exports

The library exports from `src/index.ts`:

| Export               | Description                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `ReservationDialog`  | Patient-facing reservation stepper dialog. Self-contained (includes its own providers).                                                   |
| `AdministrationPage` | Admin dashboard with calendar, services, announcements. Uses `<Routes>` internally — must be rendered inside a `<Route path="/admin/*">`. |
| `Login`              | Login/registration page. Requires `UserProvider` and a router.                                                                            |
| `UserProvider`       | Context provider for authentication state. Wrap around `Login`, `ProtectedRoute`, and `AdministrationPage`.                               |
| `useUser`            | Hook to access user auth state (`isLoggedIn`, `logIn`, `logOut`, etc.).                                                                   |
| `ProtectedRoute`     | Route guard that redirects unauthenticated users. Requires `UserProvider`.                                                                |
| `AnnouncementsList`  | Standalone announcements list component.                                                                                                  |

## Tech Stack

-   **React 18** with TypeScript
-   **MUI (Material UI)** for components
-   **SWR** for data fetching (`useSWRMutation`)
-   **React Hook Form** + **Zod** for form validation
-   **react-big-calendar** for admin calendar
-   **date-fns** for date utilities
-   **Axios** for HTTP client
-   **Vite** for bundling (ESM output, `react`/`react-dom` externalized)

## Usage in Consumer App

```bash
pnpm add @ejthbit/reservation-app
```

Add the required `VITE_*` environment variables to your `.env` file. The library reads them via `import.meta.env` at your build time.

Import the stylesheet in your app entry point:

```tsx
import '@ejthbit/reservation-app/style.css'
```

### Theming

The library uses MUI components and inherits the consumer's MUI theme. Wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const theme = createTheme({
    palette: {
        primary: { main: '#eaccb5' },
    },
    typography: {
        fontFamily: ['Poppins', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    },
})

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* your routes and reservation components */}
        </ThemeProvider>
    )
}
```

All library components (buttons, dialogs, inputs, calendar) will pick up your theme's colors, typography, and overrides.

### Reservation Dialog (patient-facing)

`ReservationDialog` is self-contained — no extra providers needed (only a `ThemeProvider` above it):

```tsx
import { ReservationDialog } from '@ejthbit/reservation-app'

function App() {
    const [open, setOpen] = useState(false)
    return <ReservationDialog isOpen={open} onClose={() => setOpen(false)} />
}
```

### Admin Section

`AdministrationPage` uses `<Routes>` internally, so mount it under a wildcard route. It needs `UserProvider` (for auth) and `SnackbarProvider` (for toast notifications):

```tsx
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { AdministrationPage, Login, UserProvider, ProtectedRoute } from '@ejthbit/reservation-app'

const theme = createTheme({
    palette: { primary: { main: '#1976d2' } },
})

function AppRoutes() {
    const navigate = useNavigate()
    return (
        <Routes>
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute shouldLogin loginPath="/login">
                        <AdministrationPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/login"
                element={<Login onGetUser={() => navigate('/admin')} isRegistrationEnabled={false} />}
            />
        </Routes>
    )
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <SnackbarProvider maxSnack={3}>
                    <UserProvider>
                        <AppRoutes />
                    </UserProvider>
                </SnackbarProvider>
            </BrowserRouter>
        </ThemeProvider>
    )
}
```

### Announcements List

Standalone component, no providers needed:

````tsx
import { AnnouncementsList } from '@ejthbit/reservation-app'

function NewsPage() {
    return <AnnouncementsList width="600px" />
}

## Releasing a New Version

1. Make sure you're on a clean working tree and all changes are committed.

2. Bump the version:

```bash
# patch (2.1.4 → 2.1.5)
pnpm version patch

# minor (2.1.4 → 2.2.0)
pnpm version minor

# major (2.1.4 → 3.0.0)
pnpm version major
````

This updates `package.json` and creates a git tag.

3. Publish to npm:

```bash
pnpm publish
```

The `prepublishOnly` script runs `pnpm build` automatically before publishing, so you don't need to build manually.

4. Push the version commit and tag:

```bash
git push && git push --tags
```
