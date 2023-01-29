import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { getContactInformation } from '../../../store/reservationProcess'
import { setContactInformation } from '../../../store/reservationProcess/reservationProcessSlice'
import { TextField, InputAdornment } from '@mui/material'
import useReservationButton from '../../../hooks/useReservationButton'
import { Phone } from '@mui/icons-material'
import { useDebounce } from '../../../hooks'
import VALIDATION_PATTERNS from '../../../utils/validationPatterns'
import { useState } from 'react'
import { string } from 'yup'

const ReservationPhone = ({ step, isRequired }) => {
    const dispatch = useDispatch()
    const { phone = '' } = useSelector(getContactInformation)

    const [isValid, setIsValid] = useState(true)
    const [nonDebounceValue, setNonDebounceValue] = useState(phone)
    useDebounce({
        value: nonDebounceValue,
        onDebounce: (value) => dispatch(setContactInformation({ phone: value })),
    })
    useReservationButton({ dependency: [nonDebounceValue], step, isRequired, isValid })

    const checkIfPhoneIsValid = async (value) => {
        const phoneValidation = string().matches(VALIDATION_PATTERNS.TEL).min(9)
        const res = await phoneValidation.isValid(value)
        return setIsValid(!!res)
    }

    return (
        <TextField
            id="phone"
            label="Telefonní číslo"
            variant="standard"
            required={isRequired}
            value={nonDebounceValue}
            onChange={(e) => setNonDebounceValue(e.target.value)}
            onBlur={(e) => checkIfPhoneIsValid(e.target.value)}
            error={!isValid}
            helperText={!isValid ? 'Nesprávný formát telefonního čísla' : ''}
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment sx={{ cursor: 'none' }} position="end">
                        <Phone />
                    </InputAdornment>
                ),
            }}
        />
    )
}
ReservationPhone.propTypes = {
    step: PropTypes.string,
    isRequired: PropTypes.bool,
}

export default ReservationPhone
