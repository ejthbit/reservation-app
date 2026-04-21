import { zodResolver } from '@hookform/resolvers/zod'
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    TextField,
} from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import VALIDATION_MESSAGES from '../../../../constants/validationMessages'
import { useFastBooking } from '../../../../context/Administration/AdministrationBookingsHooks'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'
import { useCalendarContext } from '../../../../context/Calendar/CalendarProvider'
import { useReservation } from '../../../../context/Reservation'
import { ReservationProvider } from '../../../../context/Reservation/ReservationProvider'
import { getDateWithCorrectOffset, getISODateStringWithCorrectOffset } from '../../../../utils'
import VALIDATION_PATTERNS from '../../../../utils/validationPatterns'
import { DialogButtons, FormInput } from '../../../common'
import ReservationTermPicker from '../../../Reservation/ReservationControls/ReservationTermPicker/ReservationTermPicker'
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
    note: z.string().optional(),
})

const AdministrationCreateCalendarEventDialogInner = ({
    open,
    data,
    handleClose,
}: {
    open: boolean
    data?: { start: string; end: string }
    handleClose: () => void
}) => {
    const [birthdate, setBirthDate] = useState<Date | null>(null)

    const { trigger: createFastBooking, isMutating: isCreatingBooking } = useFastBooking()
    const { selectedWorkspace } = useAdministration()
    const { refetchBookings } = useCalendarContext()
    const {
        selectedDate,
        selectedTime,
        selectedCategory,
        availableTimeSlots,
        setters: { setSelectedAmbulance, setSelectedDate, setSelectedTime },
    } = useReservation()

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
            contactInformation: { name: '', email: '', phone: '', birthdate: '' },
            note: '',
        },
    })

    const initialTime = data ? data.start.slice(11, 19) : null

    useEffect(() => {
        setSelectedAmbulance(parseInt(selectedWorkspace))
        if (data) setSelectedDate(getDateWithCorrectOffset(data.start))
    }, [])

    useEffect(() => {
        if (!initialTime || selectedTime || !availableTimeSlots.slots?.length) return
        const match = availableTimeSlots.slots.find(
            (slot) => slot.timeSlotStart.slice(11, 19) === initialTime,
        )
        if (match) setSelectedTime(initialTime)
    }, [availableTimeSlots.slots])

    const onClose = () => {
        reset()
        setBirthDate(null)
        handleClose()
    }

    const onCreate = async ({
        contactInformation,
    }: Pick<ReservationProcessData, 'contactInformation'>) => {
        await createFastBooking({
            selectedCategory,
            contactInformation,
            selectedTime,
            selectedDate,
            selectedAmbulanceId: parseInt(selectedWorkspace),
            selectedDoctor: '',
        }).then((payload) => {
            if (payload) {
                refetchBookings()
                onClose()
            }
        })
    }

    const canSubmit = isDirty && isValid && !!selectedTime && !!selectedCategory

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Rychlá objednávka</DialogTitle>
            <DialogContent sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                <ReservationTermPicker step="ADMIN" />
                <FormInput
                    name="contactInformation.name"
                    label="Jméno"
                    placeholder="Zadejte prosím jméno pacienta"
                    control={control}
                    fullWidth
                    required
                />
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
                                        { shouldDirty: true },
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
                        disabledPrimary={!canSubmit}
                    />
                </DialogActions>
            )}
        </Dialog>
    )
}

const AdministrationCreateCalendarEventDialog = ({
    open = false,
    data,
    handleClose,
}: {
    open: boolean
    data?: { start: string; end: string }
    handleClose: () => void
}) =>
    open ? (
        <ReservationProvider>
            <AdministrationCreateCalendarEventDialogInner
                open={open}
                data={data}
                handleClose={handleClose}
            />
        </ReservationProvider>
    ) : null

export default AdministrationCreateCalendarEventDialog
