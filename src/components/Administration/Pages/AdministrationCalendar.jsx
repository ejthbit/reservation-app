import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import cs from 'date-fns/locale/cs'
import './css/custom-calendar.css'

import useCalendar from '../../../hooks/useCalendar'
import { Box, Fade, useTheme } from '@mui/material'
import {
    AdministrationCalendarToolbar,
    AdministrationCalendarEvent,
    AdministrationEventDetail,
} from './components'
import { isNilOrEmpty } from '../../../utils'

const DragAndDropCalendar = withDragAndDrop(Calendar)
const calendarFormats = {
    dayRangeHeaderFormat: ({ start, end }) =>
        format(new Date(start), 'dd/MM/yyyy') + ' - ' + format(new Date(end), 'dd/MM/yyyy'),
    dayFormat: (date) => format(date, 'dd/MM/yyyy'),
    dayHeaderFormat: (date) => format(date, 'dd/MM/yyyy'),
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

const isMobile = false

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
        events,
        draggedEvent,
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
            <Box>
                <DragAndDropCalendar
                    formats={calendarFormats}
                    onEventDrop={moveEvent}
                    dragFromOutsideItem={draggedEvent ? dragFromOutsideItem() : null}
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
                                ...(event?.resource?.completed && {
                                    backgroundColor: 'dimgrey',
                                    color: 'linen',
                                    opacity: 0.7,
                                    pointerEvents: 'none',
                                }),
                                color: '#fff',
                                borderRadius: 0,
                                background: event?.resource?.completed
                                    ? theme.palette.success.light
                                    : theme.palette.primary.main,
                            },
                        }
                    }}
                    startAccessor="start"
                    selectable={false}
                    resizable={false}
                    onSelectEvent={onSelectEvent}
                    onSelectSlot={onSelectSlot}
                    components={{
                        toolbar: AdministrationCalendarToolbar,
                        event: AdministrationCalendarEvent,
                    }}
                    step={import.meta.env.VITE_APPOINTMENT_DURATION}
                    endAccessor="end"
                    style={{ height: '100vh', margin: 8 }}
                    longPressThreshold={10}
                />
                {/* <CalendarViewCreateEventDialog
                    open={!isNilOrEmpty(newAppointmentDate)}
                    handleClose={handleToggleCreationModal}
                    data={newAppointmentDate}
                /> */}
                <AdministrationEventDetail
                    event={openEventDialogEvent}
                    handleClose={() => handleOpenEventDialog(null)}
                />
            </Box>
        </Fade>
    )
}

export default AdministrationCalendar
