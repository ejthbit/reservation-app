import { CircularProgress } from '@mui/material'
import {
    ReservationSummary,
    ReservationStatus,
} from '../components/stepsContent'
import { VARIANTS } from '../components/stepsContent/ReservationStatus'
const DEFAULT_STEPS = {
    ready: {
        label: 'Shrnutí objednávky',
        component: () => <ReservationSummary />,
        step: 'READY',
    },
    completed: {
        label: 'Úspěšná objednávka',
        component: () => <ReservationStatus variant={VARIANTS.SUCCESS} />,
        step: 'COMPLETED',
    },
    error: {
        label: 'Nastala chyba',
        component: () => <ReservationStatus variant={VARIANTS.ERROR} />,
        step: 'ERROR',
    },
    default: {
        label: 'Načítaní',
        component: () => <CircularProgress />,
        step: 'LOADING',
    },
}
export default DEFAULT_STEPS
