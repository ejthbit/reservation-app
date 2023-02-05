import PropTypes from 'prop-types'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { useDispatch, useSelector } from 'react-redux'
import { getContactInformation } from '../../../store/reservationProcess'
import { setContactInformation } from '../../../store/reservationProcess/reservationProcessSlice'
import useReservationButton from '../../../hooks/useReservationButton'
import { InputAdornment, TextField } from '@mui/material'
import { Today } from '@mui/icons-material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { cs } from 'date-fns/locale'
import { getISODateStringWithCorrectOffset } from '../../../utils'

const ReservationBirthDate = ({ step, isRequired }) => {
    const { birthDate } = useSelector(getContactInformation)
    const dispatch = useDispatch()

    useReservationButton({ dependency: [birthDate], step, isRequired })

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={cs}
            localeText={{ okButtonLabel: 'Potvrdit', cancelButtonLabel: 'Zavřít' }}
        >
            <MobileDatePicker
                id="bday"
                label="Datum narození"
                placeholder="Zadejte prosím své datum narození"
                inputFormat="dd-MM-yyyy"
                mask="__-__-____"
                margin="normal"
                value={birthDate}
                name="birthDate"
                views={['year', 'month', 'day']}
                openTo="year"
                disableFuture
                onChange={(date) => {
                    dispatch(
                        setContactInformation({
                            birthDate: getISODateStringWithCorrectOffset(date).slice(0, 10),
                        })
                    )
                }}
                renderInput={({ inputRef, inputProps, label, placeholder, InputProps }) => (
                    <TextField
                        sx={{ cursor: 'pointer' }}
                        ref={inputRef}
                        {...inputProps}
                        label={label}
                        placeholder={placeholder}
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

ReservationBirthDate.propTypes = {
    step: PropTypes.string,
    isRequired: PropTypes.bool,
}

export default ReservationBirthDate
