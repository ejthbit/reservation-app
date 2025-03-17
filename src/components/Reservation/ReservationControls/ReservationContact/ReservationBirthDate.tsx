import { Today } from '@mui/icons-material'
import { InputAdornment, TextField, TextFieldProps } from '@mui/material'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { cs } from 'date-fns/locale'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset } from '../../../../utils'
import { useReservation } from '../../../../context/Reservation'
import { forwardRef } from 'react'

const BirthDateTextField = forwardRef((props: TextFieldProps, ref: React.Ref<HTMLDivElement>) => (
    <TextField
        sx={{ cursor: 'pointer' }}
        ref={ref}
        color="info"
        label={props.label}
        placeholder="Zadejte prosím své datum narození"
        variant="standard"
        fullWidth
        inputProps={{
            ...props.inputProps,
            endAdornment: (
                <InputAdornment sx={{ cursor: 'pointer' }} position="end">
                    <Today />
                </InputAdornment>
            ),
        }}
        {...props}
    />
))

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
                format="dd-MM-yyyy"
                value={birthdate ? getDateWithCorrectOffset(birthdate) : null}
                name="birthdate"
                views={['year', 'month', 'day']}
                openTo="year"
                disableFuture
                onChange={(date) =>
                    date &&
                    setContactInfo({
                        birthdate: getISODateStringWithCorrectOffset(date).slice(0, 10),
                    })
                }
                slots={{
                    textField: (props) => <BirthDateTextField required={isRequired} {...props} />,
                }}
            />
        </LocalizationProvider>
    )
}

export default ReservationBirthDate
