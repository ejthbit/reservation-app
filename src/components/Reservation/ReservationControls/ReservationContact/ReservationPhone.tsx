import { Phone } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import { z } from 'zod'
import { useDebounce } from '../../../../hooks'
import useReservationButton from '../../../../hooks/useReservationButton'
import VALIDATION_PATTERNS from '../../../../utils/validationPatterns'
import { useReservation } from '../../../../context/Reservation'

const ReservationPhone = ({ step, isRequired }: { step: string; isRequired?: boolean }) => {
    const {
        contactInformation: { phone = '' },
        setters: { setContactInfo },
    } = useReservation()

    const [isValid, setIsValid] = useState(true)
    const [nonDebounceValue, setNonDebounceValue] = useState(phone)

    useDebounce({
        value: nonDebounceValue,
        onDebounce: (value) => setContactInfo({ phone: value.trim() }),
    })

    useReservationButton({ dependency: [nonDebounceValue], step, isRequired, isValid })

    const checkIfPhoneIsValid = (value: string) => {
        const result = z.string().min(9).regex(VALIDATION_PATTERNS.TEL).safeParse(value)
        return setIsValid(result.success)
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

export default ReservationPhone
