import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    setReservationBtnDisabled,
    setSelectedAmbulance,
} from '../../store/reservationProcess/reservationProcessSlice'
import { getSelectedAmbulance } from '../../store/reservationProcess/selectors'
import { useLazyGetAmbulancesQuery } from '../../store/reservationProcess/services'
import { isNilOrEmpty } from '../../utils'
import Dropdown from '../BuildingBlocks/Dropdown'

const ReservationAmbulanceSelect = ({ showLabel = false }) => {
    const [getAmbulances, { data: ambulances }] = useLazyGetAmbulancesQuery()

    const selectedAmbulanceId = useSelector(getSelectedAmbulance)
    const dispatch = useDispatch()

    useEffect(() => {
        if (isNilOrEmpty(ambulances)) getAmbulances()
    }, [ambulances, getAmbulances])

    useEffect(() => {
        if (!isNilOrEmpty(selectedAmbulanceId))
            dispatch(setReservationBtnDisabled(true))
        else dispatch(setReservationBtnDisabled(false))
    }, [selectedAmbulanceId, dispatch])

    return (
        <>
            {showLabel && (
                <Box marginRight={2}>
                    <Typography>Vybranná ambulance</Typography>
                </Box>
            )}
            <Dropdown
                variant="standard"
                options={ambulances}
                value={selectedAmbulanceId}
                onChange={(e) => dispatch(setSelectedAmbulance(e.target.value))}
                label="Ambulance"
            />
        </>
    )
}
ReservationAmbulanceSelect.propTypes = {
    showLabel: PropTypes.bool,
}
export default ReservationAmbulanceSelect
