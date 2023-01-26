import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useReservationButton from '../../hooks/useReservationButton'
import { setSelectedAmbulance } from '../../store/reservationProcess/reservationProcessSlice'
import { makeReservationProcessInfo } from '../../store/reservationProcess/selectors'
import {
    useLazyGetAmbulancesQuery,
    useLazyGetDoctorServicesForMonthQuery,
} from '../../store/reservationProcess/services'
import { isNilOrEmpty } from '../../utils'
import Dropdown from '../BuildingBlocks/Dropdown'
const getReservationProcessInfo = makeReservationProcessInfo()
const ReservationAmbulanceSelect = ({ showLabel = false, step }) => {
    const [getAmbulances, { data: ambulances, isLoading }] = useLazyGetAmbulancesQuery()
    const [fetchDoctorServicesForSelectedMonth] = useLazyGetDoctorServicesForMonthQuery()

    const { selectedAmbulanceId, selectedMonth } = useSelector(getReservationProcessInfo)
    useReservationButton({ dependency: [selectedAmbulanceId], step, isRequired: true })
    const dispatch = useDispatch()

    useEffect(() => {
        if (isNilOrEmpty(ambulances)) getAmbulances()
    }, [ambulances])

    return (
        <>
            {showLabel && (
                <Box marginRight={2}>
                    <Typography>Vybrané pracoviště</Typography>
                </Box>
            )}
            <Dropdown
                isLoading={isLoading}
                options={ambulances}
                value={selectedAmbulanceId}
                onChange={(e) => {
                    dispatch(setSelectedAmbulance(e.target.value))
                    fetchDoctorServicesForSelectedMonth({
                        month: selectedMonth,
                        workplace: e.target.value,
                    })
                }}
            />
        </>
    )
}
ReservationAmbulanceSelect.propTypes = {
    showLabel: PropTypes.bool,
    step: PropTypes.string,
}
export default ReservationAmbulanceSelect
