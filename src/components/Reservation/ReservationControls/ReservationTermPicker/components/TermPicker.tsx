import { MobileDatePicker } from '@mui/x-date-pickers'
import { addHours, format } from 'date-fns'
import TermPickerDay from './TermPickerDay'
import TermPickerInput from './TermPickerInput'
import { useDoctorServices } from '../../../../../hooks'
import { useReservation } from '../../../../../context/Reservation'
import { AmbulanceServiceDay } from '../../../../../types/AmbulanceService'
import { getDateWithCorrectOffset } from '../../../../../utils'

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
            format="dd-MM-yyyy"
            value={getDateWithCorrectOffset(selectedDate)}
            onMonthChange={(date) => {
                const currentMonth = format(date, 'yyyy-MM')
                selectedAmbulance &&
                    fetchDoctorServicesForSelectedMonth({
                        month: currentMonth,
                        workplace: selectedAmbulance,
                    })
                setTermPickerDate(addHours(date, 1))
            }}
            slots={{
                textField: (props) => <TermPickerInput ref={props.inputRef} {...props} />,
                day: (dayComponentProps) => (
                    <TermPickerDay
                        key={format(dayComponentProps.day, 'yyyy-MM-dd')}
                        day={dayComponentProps.day}
                        DayComponentProps={dayComponentProps}
                        doctorServicesBySelectedDoctorIdAndMonth={doctorServicesBySelectedDoctorIdAndMonth}
                    />
                ),
            }}
            views={['year', 'month', 'day']}
            onChange={setTermPickerDate}
            disablePast
        />
    )
}

export default TermPicker
