import { useContext } from 'react'
import { ReservationContext } from './ReservationProvider'

export const useReservation = () => {
    const context = useContext(ReservationContext)
    if (!context) {
        throw new Error('useUser must be used within a ReservationProvider')
    }
    return context
}
