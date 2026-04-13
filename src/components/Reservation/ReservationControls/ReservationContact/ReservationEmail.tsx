import { Email } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import { z } from 'zod'
import { useDebounce } from '../../../../hooks'
import useReservationButton from '../../../../hooks/useReservationButton'
import { useReservation } from '../../../../context/Reservation'

const ReservationEmail = ({ step, isRequired }: { step: string; isRequired?: boolean }) => {
    const {
        contactInformation: { email },
        setters: { setContactInfo },
    } = useReservation()

    const [isValid, setIsValid] = useState(true)
    const [nonDebounceValue, setNonDebounceValue] = useState(email!)

    useDebounce({
        value: nonDebounceValue,
        onDebounce: (value) => setContactInfo({ email: value }),
    })
    useReservationButton({ dependency: [nonDebounceValue], step, isRequired, isValid })

    const checkIfEmailIsValid = (value: string) => {
        const result = z.string().email().safeParse(value)
        return setIsValid(result.success)
    }

    return (
        <TextField
            id="email"
            label="E-mail"
            variant="standard"
            type="email"
            autoComplete="email"
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
