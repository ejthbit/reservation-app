import { CheckCircle } from '@mui/icons-material'
import { Badge } from '@mui/material'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers'
import { format, startOfToday } from 'date-fns'

import { equals } from 'ramda'
import { isNilOrEmpty } from '../../../../../utils'
import { AmbulanceServiceDay } from '../../../../../types/AmbulanceService'

type TermPickerDayProps = {
    day: Date
    DayComponentProps: PickersDayProps<Date>
    doctorServicesBySelectedDoctorIdAndMonth: AmbulanceServiceDay[]
}
const TermPickerDay = ({
    day,
    DayComponentProps,
    doctorServicesBySelectedDoctorIdAndMonth,
}: TermPickerDayProps) => {
    const isDoctorAvailable =
        !DayComponentProps.outsideCurrentMonth &&
        doctorServicesBySelectedDoctorIdAndMonth.find(({ date, doctors }) => {
            if (!isNilOrEmpty(doctors))
                return equals(date, format(day, 'yyyy-MM-dd')) && day >= startOfToday()
        })

    return (
        <Badge
            overlap="circular"
            badgeContent={isDoctorAvailable ? <CheckCircle sx={{ height: 10 }} /> : undefined}
        >
            <PickersDay {...DayComponentProps} disabled={isNilOrEmpty(isDoctorAvailable)} />
        </Badge>
    )
}

export default TermPickerDay
