import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { getContactInformation } from '../../../../store/reservationProcess'
import { setContactInformation } from '../../../../store/reservationProcess/reservationProcessSlice'
import { TextField, InputAdornment } from '@mui/material'
import useReservationButton from '../../../../hooks/useReservationButton'
import { AccountCircle } from '@mui/icons-material'
import { useDebounce } from '../../../../hooks'
import { useState } from 'react'

const ReservationName = ({ step, isRequired }) => {
    const dispatch = useDispatch()
    const { name = '' } = useSelector(getContactInformation)
    const [nonDebounceValue, setNonDebounceValue] = useState(name)
    useDebounce({
        value: nonDebounceValue,
        onDebounce: (value) => dispatch(setContactInformation({ name: value })),
    })
    useReservationButton({ dependency: [nonDebounceValue], step, isRequired })

    return (
        <TextField
            id="name"
            label="Jméno a přijmení"
            variant="standard"
            required={isRequired}
            value={nonDebounceValue}
            onChange={(e) => {
                setNonDebounceValue(e.target.value)
            }}
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment sx={{ cursor: 'none' }} position="end">
                        <AccountCircle />
                    </InputAdornment>
                ),
            }}
        />
    )
}
ReservationName.propTypes = {
    step: PropTypes.string,
    isRequired: PropTypes.bool,
}

export default ReservationName
