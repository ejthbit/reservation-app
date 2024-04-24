// @ts-nocheck
import { Today } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { cs } from 'date-fns/locale'
import { useReservation } from 'src/context/Reservation'
import { getISODateStringWithCorrectOffset } from '../../../../utils'

const ReservationBirthDate = ({ step, isRequired = false }: { step: string; isRequired?: boolean }) => {
    const {
        contactInformation: { birthdate },
        setters: { setContactInfo },
    } = useReservation()

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={cs}
            localeText={{ okButtonLabel: 'Potvrdit', cancelButtonLabel: 'Zavřít' }}
        >
            <MobileDatePicker
                label="Datum narození"
                inputFormat="dd-MM-yyyy"
                mask="__-__-____"
                value={birthdate}
                name="birthdate"
                views={['year', 'month', 'day']}
                openTo="year"
                disableFuture
                onChange={(date) =>
                    setContactInfo({
                        birthdate: getISODateStringWithCorrectOffset(date).slice(0, 10),
                    })
                }
                renderInput={({ inputRef, inputProps, label, InputProps }) => (
                    <TextField
                        sx={{ cursor: 'pointer' }}
                        ref={inputRef}
                        {...inputProps}
                        color="info"
                        label={label}
                        placeholder="Zadejte prosím své datum narození"
                        variant="standard"
                        required={isRequired}
                        fullWidth
                        InputProps={{
                            ...InputProps,
                            endAdornment: (
                                <InputAdornment sx={{ cursor: 'pointer' }} position="end">
                                    <Today />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    )
}

export default ReservationBirthDate
