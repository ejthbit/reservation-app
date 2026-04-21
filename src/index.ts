// Reservation (patient-facing)
export { default as ReservationDialog } from './components/Reservation/ReservationDialog/ReservationDialog'

// Administration (admin dashboard — must be rendered inside a <Route>)
export { default as AdministrationPage } from './components/Administration/AdministrationPage'

// Auth
export { UserProvider, useUser } from './context/User/UserProvider'
export { default as Login } from './components/Login/Login'
export { default as ProtectedRoute } from './components/common/ProtectedRoute'

// Misc
export { default as AnnouncementsList } from './components/common/AnnouncementsList'
