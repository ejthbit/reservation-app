import { Phone } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import { string } from 'yup'
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

    const checkIfPhoneIsValid = async (value: string) => {
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

export default ReservationPhone
