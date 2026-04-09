import { PropsWithChildren, createContext, useContext } from 'react'
import useCalendar from '../../hooks/useCalendar'

type CalendarContextValue = ReturnType<typeof useCalendar>

const CalendarContext = createContext<CalendarContextValue | undefined>(undefined)

export const useCalendarContext = () => {
    const context = useContext(CalendarContext)
    if (!context) {
        throw new Error('useCalendarContext must be used within a CalendarProvider')
    }
    return context
}

export const CalendarProvider = ({ children }: PropsWithChildren) => {
    const calendar = useCalendar()
    return <CalendarContext.Provider value={calendar}>{children}</CalendarContext.Provider>
}
