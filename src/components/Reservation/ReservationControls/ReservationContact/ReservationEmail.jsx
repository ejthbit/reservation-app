import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { getContactInformation } from '../../../store/reservationProcess'
import { setContactInformation } from '../../../store/reservationProcess/reservationProcessSlice'
import { TextField, InputAdornment } from '@mui/material'
import useReservationButton from '../../../hooks/useReservationButton'
import { Email } from '@mui/icons-material'
import { string } from 'yup'
import { useState } from 'react'
import { useDebounce } from '../../../hooks'

const ReservationEmail = ({ step, isRequired }) => {
    const dispatch = useDispatch()
    const { email } = useSelector(getContactInformation)

    const [isValid, setIsValid] = useState(true)
    const [nonDebounceValue, setNonDebounceValue] = useState(email)

    useDebounce({
        value: nonDebounceValue,
        onDebounce: (value) => dispatch(setContactInformation({ email: value })),
    })
    useReservationButton({ dependency: [nonDebounceValue], step, isRequired, isValid })

    const checkIfEmailIsValid = async (value) => {
        const emailValidation = string().email()
        const res = await emailValidation.isValid(value)
        return setIsValid(!!res)
    }

    return (
        <TextField
            id="email"
            label="Email"
            variant="standard"
            required={isRequired}
            value={nonDebounceValue}
            helperText={!isValid ? 'Email je nevalidní!' : ''}
            error={!isValid}
            onChange={(e) => setNonDebounceValue(e.target.value)}
            onBlur={(e) => checkIfEmailIsValid(e.target.value)}
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment sx={{ cursor: 'none' }} position="end">
                        <Email />
                    </InputAdornment>
                ),
            }}
        />
    )
}
ReservationEmail.propTypes = {
    step: PropTypes.string,
    isRequired: PropTypes.bool,
}

export default ReservationEmail
