import { MobileDatePicker } from '@mui/x-date-pickers'
import { addHours, format } from 'date-fns'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
    makeReservationProcessInfo,
    useLazyGetDoctorServicesForMonthQuery,
} from '../../../../store/reservationProcess'
import { setSelectedDate } from '../../../../store/reservationProcess/reservationProcessSlice'
import { getISODateStringWithCorrectOffset } from '../../../../utils'
import TermPickerDay from './TermPickerDay'
import TermPickerInput from './TermPickerInput'

const getReservationProcessInfo = makeReservationProcessInfo()
const TermPicker = ({ doctorServicesBySelectedDoctorIdAndMonth }) => {
    const dispatch = useDispatch()
    const { selectedAmbulanceId, selectedDate } = useSelector(getReservationProcessInfo)

    const [fetchDoctorServicesForSelectedMonth] = useLazyGetDoctorServicesForMonthQuery()

    const setTermPickerDate = (date) =>
        dispatch(setSelectedDate(getISODateStringWithCorrectOffset(date)))
    // Fetches services for selected month

    return (
        <MobileDatePicker
            label="Datum návštevy"
            variant="dialog"
            inputFormat="dd-MM-yyyy"
            mask="__-__-____"
            value={selectedDate}
            onMonthChange={(date) => {
                const currentMonth = format(date, 'yyyy-MM')
                fetchDoctorServicesForSelectedMonth({
                    month: currentMonth,
                    workplace: selectedAmbulanceId,
                })
                setTermPickerDate(addHours(date, 1))
            }}
            renderDay={(day, _value, DayComponentProps) => (
                <TermPickerDay
                    key={format(day, 'yyyy-MM-dd')}
                    day={day}
                    DayComponentProps={DayComponentProps}
                    doctorServicesBySelectedDoctorIdAndMonth={
                        doctorServicesBySelectedDoctorIdAndMonth
                    }
                />
            )}
            views={['year', 'month', 'day']}
            renderInput={(props) => <TermPickerInput ref={props.inputRef} {...props} />}
            onChange={setTermPickerDate}
            disablePast
        />
    )
}

TermPicker.propTypes = {
    doctorServicesBySelectedDoctorIdAndMonth: PropTypes.array,
}

export default TermPicker
