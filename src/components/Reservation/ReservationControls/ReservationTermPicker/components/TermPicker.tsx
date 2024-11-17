import { MobileDatePicker } from '@mui/x-date-pickers'
import { addHours, format } from 'date-fns'
import TermPickerDay from './TermPickerDay'
import TermPickerInput from './TermPickerInput'
import { useDoctorServices } from '../../../../../hooks'
import { useReservation } from '../../../../../context/Reservation'
import { AmbulanceServiceDay } from '../../../../../types/AmbulanceService'

const TermPicker = ({
    doctorServicesBySelectedDoctorIdAndMonth = [],
}: {
    doctorServicesBySelectedDoctorIdAndMonth: AmbulanceServiceDay[]
}) => {
    const {
        selectedAmbulance,
        selectedDate,
        setters: { setSelectedDate },
    } = useReservation()
    const {
        api: { fetchDoctorServicesForSelectedMonth },
    } = useDoctorServices()

    const setTermPickerDate = (date: Date | null) => setSelectedDate(date!)

    return (
        <MobileDatePicker
            label="Datum návštevy"
            inputFormat="dd-MM-yyyy"
            mask="__-__-____"
            value={selectedDate}
            onMonthChange={(date) => {
                const currentMonth = format(date, 'yyyy-MM')
                selectedAmbulance &&
                    fetchDoctorServicesForSelectedMonth({
                        month: currentMonth,
                        workplace: selectedAmbulance,
                    })
                setTermPickerDate(addHours(date, 1))
            }}
            renderDay={(day, _value, DayComponentProps) => (
                <TermPickerDay
                    key={format(day, 'yyyy-MM-dd')}
                    day={day}
                    DayComponentProps={DayComponentProps}
                    doctorServicesBySelectedDoctorIdAndMonth={doctorServicesBySelectedDoctorIdAndMonth}
                />
            )}
            views={['year', 'month', 'day']}
            renderInput={(props) => <TermPickerInput ref={props.inputRef} {...props} />}
            onChange={setTermPickerDate}
            disablePast
        />
    )
}

export default TermPicker
