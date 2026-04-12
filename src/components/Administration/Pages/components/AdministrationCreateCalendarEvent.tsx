import { zodResolver } from '@hookform/resolvers/zod'
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
import { MobileDatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import VALIDATION_MESSAGES from '../../../../constants/validationMessages'
import { useFastBooking } from '../../../../context/Administration/AdministrationBookingsHooks'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { useCalendarContext } from '../../../../context/Calendar/CalendarProvider'
import { makeArrayOfLabelValue } from '../../../../context/Reservation/ReservationHelpers'
import { useGetCategories } from '../../../../hooks/useGetCategories'
import { Category } from '../../../../types'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset } from '../../../../utils'
import VALIDATION_PATTERNS from '../../../../utils/validationPatterns'
import { DialogButtons, FormInput, FormSelectInput } from '../../../common'
import { ReservationProcessData } from '../../../Reservation/ReservationDialog/helpers/prepareReservationForCreation'

const formValidationSchema = z.object({
    contactInformation: z.object({
        name: z.string().min(1, VALIDATION_MESSAGES.IS_REQUIRED_FIELD),
        email: z.email(VALIDATION_MESSAGES.IS_NOT_CORRECT_FORMAT).nullable().optional().or(z.literal('')),
        phone: z
            .string()
            .regex(VALIDATION_PATTERNS.TEL, VALIDATION_MESSAGES.IS_NOT_CORRECT_FORMAT)
            .min(9, 'Hodnota musí mít minimálně 9 číslic.')
            .nullable()
            .optional()
            .or(z.literal('')),
        birthdate: z.string().optional(),
    }),
    selectedCategory: z
        .union([z.number(), z.string()])
        .refine((val) => val !== '', VALIDATION_MESSAGES.IS_REQUIRED_FIELD),
    note: z.string().optional(),
})
const AdministrationCreateCalendarEventDialog = ({
    open = false,
    data,
    handleClose,
}: {
    open: boolean
    data: { start: string; end: string }
    handleClose: () => void
}) => {
    const { start, end } = data
    const [birthdate, setBirthDate] = useState<Date | null>(null)

    const { data: categories, isLoading: isLoadingCategories } = useGetCategories()
    const { trigger: createFastBooking, isMutating: isCreatingBooking } = useFastBooking()
    const { selectedWorkspace } = useAdministration()
    const { refetchBookings } = useCalendarContext()
    const {
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { isDirty, isValid },
    } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        resolver: zodResolver(formValidationSchema),
        defaultValues: {
            contactInformation: {
                name: '',
                email: '',
                phone: '',
                birthdate: '',
            },
            selectedCategory: '',
            note: '',
        },
    })

    const onClose = () => {
        reset()
        setBirthDate(null)
        handleClose()
    }

    const onCreate = async ({
        contactInformation,
        selectedCategory,
    }: Pick<ReservationProcessData, 'contactInformation' | 'selectedCategory'>) => {
        await createFastBooking({
            selectedCategory,
            contactInformation,
            selectedTime: start.slice(11, 19),
            selectedDate: start.slice(0, 10),
            selectedAmbulanceId: parseInt(selectedWorkspace),
            selectedDoctor: '',
        }).then((payload) => {
            if (payload) {
                refetchBookings()
                onClose()
            }
        })
    }

    return (
        open && (
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle id="form-dialog-title">Rychlá objednávka</DialogTitle>
                <DialogContent sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    <Box marginBottom={1}>
                        <Typography>{`Vybraný termín: ${format(
                            getDateWithCorrectOffset(start),
                            'dd/MM/yyyy HH:mm:ss',
                        )} - ${format(getDateWithCorrectOffset(end), 'dd/MM/yyyy HH:mm:ss')}`}</Typography>
                    </Box>
                    <FormInput
                        name="contactInformation.name"
                        label="Jméno"
                        placeholder="Zadejte prosím jméno pacienta"
                        control={control}
                        fullWidth
                        required
                    />
                    <FormSelectInput
                        sx={{ marginTop: 0.5 }}
                        label="Typ vyšetření"
                        name="selectedCategory"
                        control={control}
                        fullWidth
                        required
                    >
                        {!isLoadingCategories &&
                            categories &&
                            makeArrayOfLabelValue<Category[]>('name', 'category_id', categories).map(
                                ({ label, value }) => (
                                    <MenuItem key={label} value={value}>
                                        {label}
                                    </MenuItem>
                                ),
                            )}
                    </FormSelectInput>

                    <Controller
                        name="contactInformation.birthdate"
                        control={control}
                        render={({ field }) => (
                            <MobileDatePicker
                                disableFuture
                                label="Datum narození"
                                openTo="year"
                                views={['year', 'month', 'day']}
                                format="dd-MM-yyyy"
                                value={birthdate}
                                slots={{
                                    textField: (params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            helperText="Zadejte prosím datum narození pacienta"
                                        />
                                    ),
                                }}
                                onChange={(date: Date | null) => {
                                    field.onChange(date)
                                    if (date && new Date(date).getTime()) {
                                        setBirthDate(date)
                                        setValue(
                                            'contactInformation.birthdate',
                                            getISODateStringWithCorrectOffset(date),
                                            {
                                                shouldDirty: true,
                                            },
                                        )
                                    }
                                }}
                            />
                        )}
                    />

                    <Box sx={{ display: 'flex', direction: 'row', gap: 1 }}>
                        <FormInput
                            name="contactInformation.email"
                            label="E-mail"
                            placeholder="Zadejte prosím e-mail pacienta"
                            control={control}
                            sx={{ width: '50%' }}
                            fullWidth
                        />
                        <FormInput
                            name="contactInformation.phone"
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

export default AdministrationCreateCalendarEventDialog
