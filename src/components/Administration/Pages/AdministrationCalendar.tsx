import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import cs from 'date-fns/locale/cs'
import './css/custom-calendar.css'

import useCalendar from '../../../hooks/useCalendar'
import { Box, CircularProgress, Fade, useTheme } from '@mui/material'
import {
    AdministrationCalendarToolbar,
    AdministrationCalendarEvent,
    AdministrationEventDetail,
    AdministrationCreateCalendarEventDialog,
    AdministrationCalendarHeader,
} from './components'
import { isMobile } from '../../../utils'
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
const AdministrationCalendar = () => {
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
        handleOpenEventDialog,
        handleToggleCreationModal,
    } = useCalendar()
    const theme = useTheme()
    return (
        <Fade in timeout={{ enter: 1000 }}>
            <Box sx={{ zIndex: '1000', width: '100%' }}>
                <DragAndDropCalendar
                    formats={calendarFormats}
                    onEventDrop={moveEvent}
                    // dragFromOutsideItem={(event: BookingEvent) => dragFromOutsideItem(event)}
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
                                backgroundColor: theme.palette.primary.main,
                                color: '#fff',
                                ...(event?.resource?.blocked && {
                                    backgroundColor: 'grey',
                                    color: 'linen',
                                    opacity: 1,
                                }),
                                ...(event?.resource?.completed && {
                                    backgroundColor: 'green',
                                    color: 'linen',
                                    opacity: 0.7,
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
                <AdministrationCreateCalendarEventDialog
                    open={!newAppointmentDate}
                    handleClose={handleToggleCreationModal}
                    data={newAppointmentDate!}
                />
                {openEventDialogEvent && (
                    <AdministrationEventDetail
                        event={openEventDialogEvent}
                        handleClose={() => handleOpenEventDialog(openEventDialogEvent)}
                    />
                )}
            </Box>
        </Fade>
    )
}

export default AdministrationCalendar
