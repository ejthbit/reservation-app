/* eslint-disable react/jsx-one-expression-per-line */
import { Grid, Typography } from '@mui/material'
import { map, reject, values } from 'ramda'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
    getContactInformation,
    makeAppointmentDate,
} from '../../../../store/reservationProcess/selectors'
import { isNilOrEmpty } from '../../../../utils'

const getAppointmentDate = makeAppointmentDate()
const ReservationSummary = () => {
    const contactInformation = useSelector(getContactInformation)
    const appointmentDate = useSelector(getAppointmentDate)

    const userInfo = useMemo(
        () =>
            map(
                (item) =>
                    !isNilOrEmpty(item) ? { title: item, value: item } : null,
                values(contactInformation)
            ),
        [contactInformation]
    )

    const summaryInformation = useMemo(
        () =>
            reject(isNilOrEmpty, [
                {
                    title: `Termín návštevy: ${appointmentDate}`,
                    value: appointmentDate,
                },
                ...userInfo,
            ]),
        [appointmentDate, userInfo]
    )

    return (
        <Grid container direction="column">
            {map(
                ({ title, value }) =>
                    !isNilOrEmpty(value) && (
                        <Typography key={value}>{title}</Typography>
                    ),
                summaryInformation
            )}
        </Grid>
    )
}

export default ReservationSummary
