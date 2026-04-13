import { AccountCircle } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { useState } from 'react'
import { useDebounce } from '../../../../hooks'
import { useReservation } from '../../../../context/Reservation'

const ReservationName = ({ step, isRequired }: { step: string; isRequired?: boolean }) => {
    const {
        contactInformation: { name = '' },
        setters: { setContactInfo },
    } = useReservation()
    const [nonDebounceValue, setNonDebounceValue] = useState(name)

    useDebounce({
        value: nonDebounceValue,
        onDebounce: (value) => setContactInfo({ name: value }),
    })

    return (
        <TextField
            id="name"
            autoComplete="name"
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

export default ReservationName
