# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Style

Respond like a caveman. No articles, no filler words, no pleasantries.
Short. Direct. Code speaks for itself.
If asked for code, give code. No explain unless asked.
No sycophancy. No restating the question. No sign-offs.

## What This Is

A React component library (`@ejthbit/reservation-app`) for managing medical/ambulance reservations. It is published as an npm package — not a standalone app. The library exports `ReservationDialog`, `AdministrationPage`, `Login`, `UserProvider`, `useUser`, `ProtectedRoute`, and `AnnouncementsList` from `src/index.ts`.

The app UI is in Czech (e.g. snackbar messages, labels).

## Commands

-   **Dev server:** `pnpm dev` (Vite, port 3003)
-   **Build:** `pnpm build` (runs `tsc` then `vite build`, outputs to `dist/`)
-   **Build dev:** `pnpm build:dev` (development build)
-   **Preview as MFE:** `pnpm run:mfe` (builds dev then serves via `vite preview` on port 5000)
-   **Lint:** `pnpm lint` (ESLint on `src/`)

No test framework is configured.

## Architecture

### Library Entry Point

`src/index.ts` exports the public API. `src/main.tsx` is only used for local dev (mounts `ApplicationContainer` with `BrowserRouter`).

### State Management

Uses React Context + `useState` — no Redux or external state library. Three context providers:

-   **ReservationProvider** (`src/context/Reservation/ReservationProvider.tsx`): Manages the entire reservation flow — ambulance/doctor/category/date/time selection, contact info, booking creation. Uses `useSWRMutation` for API calls (fetching time slots, creating bookings, fetching doctors).
-   **AdministrationProvider** (`src/context/Administration/AdministrationProvider.tsx`): Tracks selected workspace and calendar date range.
-   **UserProvider** (`src/context/User/UserProvider.tsx`): User authentication state.

Each context exposes its hook (`useReservation`, `useAdministration`, `useUser`).

### Data Fetching

SWR mutations (`useSWRMutation`) for all API calls. Axios instance configured in `src/api/config.ts` with `VITE_API_BASE_URL` env var. Auth via JWT token stored in `localStorage`.

### Key Patterns

-   **Theming:** The library does not bundle its own theme — it inherits the consumer's MUI `ThemeProvider`. The dev server (`ApplicationContainer.tsx`) provides a local theme for development only.
-   **Date handling:** Custom timezone offset utilities in `src/utils/` (`getDateWithCorrectOffset`, `getISODateStringWithCorrectOffset`) — these exist to handle timezone issues, don't replace them with plain `toISOString()`.
-   **Calendar:** `react-big-calendar` in the admin section with drag-and-drop. `useCalendar` hook (`src/hooks/useCalendar.ts`) manages events, blocked time slots, and doctor service intervals.
-   **Reservation flow:** Multi-step stepper dialog. Steps defined in `src/components/Reservation/ReservationDialog/constants/defaultSteps.tsx`.

### Component Structure

-   `src/components/Reservation/` — Patient-facing reservation flow (button, dialog, stepper, form controls)
-   `src/components/Administration/` — Admin dashboard (calendar, services management, navigation/drawer layout)
-   `src/components/Login/` — Login and registration pages
-   `src/components/common/` — Shared components (forms, tables, dialogs)

### Environment Variables

Accessed via `import.meta.env`:

-   `VITE_API_BASE_URL` — API base URL
-   `VITE_APPOINTMENT_DURATION` — Default appointment duration in minutes

### Build Output

Built as a library (ESM only) with `react` and `react-dom` externalized. Type declarations generated via `vite-plugin-dts`.
