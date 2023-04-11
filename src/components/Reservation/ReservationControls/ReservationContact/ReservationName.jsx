import { AccountCircle } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDebounce } from '../../../../hooks'
import { getContactInformation } from '../../../../store/reservationProcess'
import { setContactInformation } from '../../../../store/reservationProcess/reservationProcessSlice'

const ReservationName = ({ step, isRequired }) => {
    const dispatch = useDispatch()
    const { name = '' } = useSelector(getContactInformation)
    const [nonDebounceValue, setNonDebounceValue] = useState(name)
    useDebounce({
        value: nonDebounceValue,
        onDebounce: (value) => dispatch(setContactInformation({ name: value })),
    })
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
