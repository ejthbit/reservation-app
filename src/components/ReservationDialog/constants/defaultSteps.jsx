import { CircularProgress } from '@mui/material'
import { ReservationStatus, ReservationSummary } from '../components/stepsContent'
const DEFAULT_STEPS = {
    ready: {
        label: 'Shrnutí objednávky',
        component: <ReservationSummary />,
        step: 'READY',
    },
    completed: {
        label: 'Úspěšná objednávka',
        component: <ReservationStatus />,
        step: 'COMPLETED',
    },
    error: {
        label: 'Nastala chyba',
        component: <ReservationStatus />,
        step: 'ERROR',
    },
    default: {
        label: 'Načítaní',
        component: <CircularProgress />,
        step: 'LOADING',
    },
}
export default DEFAULT_STEPS
