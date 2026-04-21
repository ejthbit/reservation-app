import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import cs from 'date-fns/locale/cs'
import './css/custom-calendar.css'

import { CalendarProvider, useCalendarContext } from '../../../context/Calendar/CalendarProvider'
import { Box, CircularProgress, Fade, useTheme } from '@mui/material'
import { isMobile } from '../../../utils'
import {
    AdministrationCalendarToolbar,
    AdministrationCalendarEvent,
    AdministrationEventDetail,
    AdministrationCreateCalendarEventDialog,
    AdministrationCalendarHeader,
} from './components'
import { BookingEvent, BookingEventResource } from '../../../utils/makeCalendarEventsFromBookings'

const DragAndDropCalendar = withDragAndDrop<BookingEvent, BookingEventResource>(Calendar)
const calendarFormats = {
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
        format(new Date(start), 'dd/MM/yyyy') + ' - ' + format(new Date(end), 'dd/MM/yyyy'),
    dayFormat: (date: Date) => format(date, 'eeee dd/MM/yyyy', { locale: cs }),
    dayHeaderFormat: (date: Date) => format(date, 'dd/MM/yyyy'),
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
        cs,
    },
})

const customStyleDayPropGetter = () => {
    return {
        className: 'headerDay',
        style: {
            minWidth: '3vh',
        },
    }
}

/**
 * Styling left column with times
 * row height
 */
const customSlotPropGetter = () => {
    return {
        className: 'slot',
        style: {
            minHeight: isMobile ? '7vh' : '4rem',
        },
    }
}
const AdministrationCalendarInner = () => {
    const {
        newAppointmentDate,
        openEventDialogEvent,
        isLoadingEventsForSelectedView,
        events,
        moveEvent,
        handleDragStart,
        dragFromOutsideItem,
        onSelectEvent,
        onDropFromOutside,
        onSelectSlot,
        handleCloseEventDialog,
        handleToggleCreationModal,
        openFastBooking,
        handleCloseFastBooking,
    } = useCalendarContext()
    const theme = useTheme()
    return (
        <Fade in timeout={{ enter: 1000 }}>
            <Box
                sx={{
                    zIndex: '1000',
                    width: '100%',
                    height: isMobile ? 'calc(100vh - 56px)' : 'calc(100vh - 90px)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <DragAndDropCalendar
                    style={{ flex: 1, minHeight: 0 }}
                    formats={calendarFormats}
                    onEventDrop={moveEvent}
                    dragFromOutsideItem={dragFromOutsideItem as unknown as () => keyof BookingEvent}
                    onDropFromOutside={onDropFromOutside}
                    handleDragStart={handleDragStart}
                    min={new Date(0, 0, 0, 7, 0, 0)}
                    max={new Date(0, 0, 0, 19, 0, 0)}
                    localizer={localizer}
                    events={events}
                    views={{ work_week: true, day: true }}
                    defaultView={isMobile ? 'day' : 'work_week'}
                    culture="cs"
                    defaultDate={new Date()}
                    slotPropGetter={customSlotPropGetter}
                    dayPropGetter={customStyleDayPropGetter}
                    eventPropGetter={(event) => {
                        return {
                            className: 'slot',
                            style: {
                                borderLeft: `2px solid ${theme.palette.primary.dark}`,
                                backgroundColor: theme.palette.primary.light,
                                color: 'black',
                                ...(event?.resource?.doctorService && {
                                    backgroundColor: '#fff',
                                    color: '#333',
                                    border: 'none',
                                    opacity: 1,
                                }),
                                ...(event?.resource?.blocked && {
                                    borderLeft: 'none',
                                    backgroundColor: theme.palette.grey[300],
                                    color: 'black',
                                    opacity: 1,
                                    cursor: 'default',
                                }),
                                ...(event?.resource?.completed && {
                                    borderLeft: `2px solid ${theme.palette.success.dark}`,
                                    backgroundColor: theme.palette.success.light,
                                    color: 'black',
                                    opacity: 0.7,
                                }),
                                ...(event?.resource?.vacation && {
                                    backgroundColor: theme.palette.warning.light,
                                    color: 'black',
                                    opacity: 0.7,
                                    pointerEvents: 'none' as const,
                                    cursor: 'default',
                                    border: 'none',
                                }),
                                borderRadius: 0,
                            },
                        }
                    }}
                    startAccessor="start"
                    selectable
                    resizable={false}
                    onSelecting={() => false}
                    onSelectEvent={onSelectEvent}
                    onSelectSlot={onSelectSlot}
                    components={{
                        header: AdministrationCalendarHeader,
                        toolbar: AdministrationCalendarToolbar,
                        event: AdministrationCalendarEvent,
                        work_week: { header: AdministrationCalendarHeader },
                        day: { header: AdministrationCalendarHeader },
                    }}
                    step={import.meta.env.VITE_APPOINTMENT_DURATION}
                    endAccessor="end"
                    longPressThreshold={10}
                />
                {isLoadingEventsForSelectedView && (
                    <Fade in timeout={{ enter: 1000 }}>
                        <CircularProgress
                            size={100}
                            sx={{ zIndex: '1200', position: 'fixed', top: '50vh', left: '50vw' }}
                        />
                    </Fade>
                )}
                {newAppointmentDate && (
                    <AdministrationCreateCalendarEventDialog
                        open={!!newAppointmentDate.start}
                        handleClose={handleToggleCreationModal}
                        data={newAppointmentDate}
                    />
                )}
                {openFastBooking && (
                    <AdministrationCreateCalendarEventDialog
                        open={openFastBooking}
                        handleClose={handleCloseFastBooking}
                    />
                )}
                {openEventDialogEvent && (
                    <AdministrationEventDetail
                        event={openEventDialogEvent}
                        handleClose={handleCloseEventDialog}
                    />
                )}
            </Box>
        </Fade>
    )
}

const AdministrationCalendar = () => (
    <CalendarProvider>
        <AdministrationCalendarInner />
    </CalendarProvider>
)

export default AdministrationCalendar
