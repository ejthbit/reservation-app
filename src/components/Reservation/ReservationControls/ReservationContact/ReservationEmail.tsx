import { Email } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import { useReservation } from 'src/context/Reservation'
import { string } from 'yup'
import { useDebounce } from '../../../../hooks'
import useReservationButton from '../../../../hooks/useReservationButton'

const ReservationEmail = ({ step, isRequired }: { step: string; isRequired?: boolean }) => {
    const {
        contactInformation: { email },
        setters: { setContactInfo },
    } = useReservation()

    const [isValid, setIsValid] = useState(true)
    const [nonDebounceValue, setNonDebounceValue] = useState(email)

    useDebounce({
        value: nonDebounceValue,
        onDebounce: (value) => setContactInfo({ email: value }),
    })
    useReservationButton({ dependency: [nonDebounceValue], step, isRequired, isValid })

    const checkIfEmailIsValid = async (value: string) => {
        const emailValidation = string().email()
        const res = await emailValidation.isValid(value)
        return setIsValid(!!res)
    }

    return (
        <TextField
            id="email"
            label="E-mail"
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

export default ReservationEmail
