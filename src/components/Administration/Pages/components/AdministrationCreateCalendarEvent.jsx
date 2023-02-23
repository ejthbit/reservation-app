import { yupResolver } from '@hookform/resolvers/yup'
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import PropTypes from 'prop-types'
import { map } from 'ramda'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import VALIDATION_MESSAGES from '../../../../constants/validationMessages'
import { getUserConfigurationSelectedAmbulance } from '../../../../store/administration'
import { useFastBookingMutation } from '../../../../store/administration/services'
import { useLazyGetBookingCategoriesQuery } from '../../../../store/reservationProcess'
import { getUserInfo } from '../../../../store/userInfo'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset, isNilOrEmpty } from '../../../../utils'
import VALIDATION_PATTERNS from '../../../../utils/validationPatterns'
import { DialogButtons, FormInput, FormSelectInput } from '../../../common'

const formValidationSchema = yup.object({
    name: yup.string().required(VALIDATION_MESSAGES.IS_REQUIRED_FIELD),
    category: yup.number().required(VALIDATION_MESSAGES.IS_REQUIRED_FIELD),
    contact: yup
        .object({
            email: yup.string().email(VALIDATION_MESSAGES.IS_NOT_CORRECT_FORMAT).notRequired().nullable(),
            phone: yup.string().when('$exists', {
                is: (exists) => exists,
                then: yup
                    .string()
                    .matches(
                        VALIDATION_PATTERNS.TEL,
                        { message: VALIDATION_MESSAGES.IS_NOT_CORRECT_FORMAT, excludeEmptyString: true },
                        VALIDATION_MESSAGES.IS_NOT_CORRECT_FORMAT
                    )
                    .min(9, 'Hodnota musí mít minimálně 9 číslic.'),
                otherwise: yup.string().nullable().notRequired(),
            }),
        })
        .notRequired(),
})
const AdministrationCreateCalendarEvent = ({ open = false, data, handleClose }) => {
    const { start, end } = data
    const [birthDate, setBirthDate] = useState(null)

    const [getReservationCategories, { currentData: categories }] = useLazyGetBookingCategoriesQuery()
    const [createFastBooking, { isLoading: isCreatingBooking }] = useFastBookingMutation()
    const selectedAmbulanceId = useSelector(
        (state) => getUserConfigurationSelectedAmbulance(state) ?? getUserInfo(state)?.default_workplace
    )

    const {
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { isDirty, isValid },
    } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        resolver: yupResolver(formValidationSchema),
        defaultValues: {
            name: '',
            contact: {
                email: '',
                phone: '',
            },
            birthDate: '',
            category: '',
            note: '',
        },
    })

    const onClose = () => {
        reset()
        setBirthDate(null)
        handleClose()
    }

    const onCreate = async (bookingValues) => {
        await createFastBooking({
            ...bookingValues,
            ...data,
            workplace: selectedAmbulanceId,
        })
            .unwrap()
            .then((payload) => payload && onClose())
    }

    useEffect(() => {
        if (isNilOrEmpty(categories)) getReservationCategories()
    }, [categories])

    return (
        open && (
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle id="form-dialog-title">Rychlá objednávka</DialogTitle>
                <DialogContent sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    <Box marginBottom={1}>
                        <Typography>{`Vybraný termín: ${format(
                            getDateWithCorrectOffset(start),
                            'dd/MM/yyyy HH:mm:ss'
                        )} - ${format(getDateWithCorrectOffset(end), 'dd/MM/yyyy HH:mm:ss')}`}</Typography>
                    </Box>
                    <FormInput
                        name="name"
                        label="Jméno"
                        placeholder="Zadejte prosím jméno pacienta"
                        control={control}
                        fullWidth
                        required
                    />
                    <FormSelectInput
                        sx={{ marginTop: 0.5 }}
                        label="Typ vyšetření"
                        name="category"
                        control={control}
                        fullWidth
                        required
                    >
                        {map(
                            ({ label, value }) => (
                                <MenuItem key={label} value={value}>
                                    {label}
                                </MenuItem>
                            ),
                            categories
                        )}
                    </FormSelectInput>
                    <DatePicker
                        disableFuture
                        label="Datum narození"
                        openTo="year"
                        views={['year', 'month', 'day']}
                        inputFormat="dd-MM-yyyy"
                        mask="__-__-____"
                        name="birthDate"
                        value={birthDate}
                        placeholder="Zadejte prosím datum narození pacienta"
                        control={control}
                        onChange={(date) => {
                            if (new Date(date).getTime()) {
                                setBirthDate(date)
                                console.log(getISODateStringWithCorrectOffset(date))
                                setValue('birthDate', getISODateStringWithCorrectOffset(date), {
                                    shouldDirty: true,
                                })
                            }
                        }}
                        renderInput={(params) => <TextField {...params} variant="standard" />}
                    />
                    <Box sx={{ display: 'flex', direction: 'row', gap: 1 }}>
                        <FormInput
                            name="contact.email"
                            label="E-mail"
                            placeholder="Zadejte prosím e-mail pacienta"
                            control={control}
                            sx={{ width: '50%' }}
                            fullWidth
                        />
                        <FormInput
                            name="contact.phone"
                            label="Telefonní číslo"
                            placeholder="Zadejte prosím telefon pacienta"
                            control={control}
                            sx={{ width: '50%' }}
                            fullWidth
                        />
                    </Box>
                    <FormInput
                        label="Poznámka (pouze interní)"
                        placeholder="Poznámka"
                        control={control}
                        name="note"
                        multiline
                        rows={5}
                        fullWidth
                    />
                </DialogContent>
                {isCreatingBooking ? (
                    <LinearProgress />
                ) : (
                    <DialogActions>
                        <DialogButtons
                            onSecondaryClick={onClose}
                            secondaryLabel="Zavřit"
                            primaryLabel="Vytvořit novou objednávku"
                            onPrimaryClick={handleSubmit(onCreate)}
                            disabledPrimary={!isDirty || !isValid}
                        />
                    </DialogActions>
                )}
            </Dialog>
        )
    )
}

AdministrationCreateCalendarEvent.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    data: PropTypes.object,
}

export default AdministrationCreateCalendarEvent
