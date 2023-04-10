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
    AdministrationCreateCalendarEvent,
} from './components'
import { isMobile, isNilOrEmpty } from '../../../utils'
import { withTheme } from '../../../hoc'

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
            <Box
                className={isLoadingEventsForSelectedView ? 'loading' : null}
                sx={{ zIndex: '1000', width: '100%' }}
            >
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
                                backgroundColor: theme.palette.primary.main,
                                position: 'sticky',
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
                                ...(event?.resource?.doctorService && {
                                    backgroundColor: 'lightgrey',
                                    color: 'black',
                                    opacity: 0.7,
                                    pointerEvents: 'none',
                                    position: 'absolute',
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
                <AdministrationCreateCalendarEvent
                    open={!isNilOrEmpty(newAppointmentDate)}
                    handleClose={handleToggleCreationModal}
                    data={newAppointmentDate}
                />
                <AdministrationEventDetail
                    event={openEventDialogEvent}
                    handleClose={() => handleOpenEventDialog(null)}
                />
            </Box>
        </Fade>
    )
}

export default AdministrationCalendar
