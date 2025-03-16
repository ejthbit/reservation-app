import { Delete } from '@mui/icons-material'
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    LinearProgress,
    MenuItem,
    TextField,
} from '@mui/material'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { addMinutes } from 'date-fns'
import PropTypes from 'prop-types'
import { map } from 'ramda'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
    useDeleteBooking,
    useUpdateBooking,
} from '../../../../context/Administration/AdministrationBookingsHooks'
import { makeArrayOfLabelValue } from '../../../../context/Reservation/ReservationHelpers'
import { useGetCategories } from '../../../../hooks/useGetCategories'
import { UpdatedBooking } from '../../../../types'
import { getISODateStringWithCorrectOffset, isNilOrEmpty } from '../../../../utils'
import { BookingEvent } from '../../../../utils/makeCalendarEventsFromBookings'
import { DialogButtons, FormInput, FormSelectInput } from '../../../common'

const AdministrationEventDetail = ({
    event,
    handleClose,
}: {
    event: BookingEvent
    handleClose: () => void
}) => {
    const [startValue, setStartValue] = useState<Date | null>(null)
    const [completedValue, setCompletedValue] = useState(false)
    const { trigger: updateBooking, isMutating: updatingBooking } = useUpdateBooking()
    const { trigger: deleteBooking, isMutating: deletingBooking } = useDeleteBooking()

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
        setValue,
    } = useForm({
        defaultValues: {
            start: '',
            end: '',
            name: '',
            birthdate: '',
            category: 0,
            phone: '',
            email: '',
            note: '',
            selectedDoctorId: '',
            completed: !!completedValue,
        },
    })

    if (!event.id) {
        return null
    }

    const handlePatchBooking = async (updatedBooking: Omit<UpdatedBooking, 'id' | 'workplace'>) => {
        if (event.id) {
            await updateBooking({
                ...updatedBooking,
                id: event.id,
                workplace: event.resource?.workplace ?? 1,
                end: addMinutes(
                    new Date(updatedBooking.start),
                    import.meta.env.VITE_APPOINTMENT_DURATION,
                ).toISOString(),
            }).then((payload) => payload && handleClose())
        }
    }
    const handleDeleteBooking = async () => {
        const confirmDelete = window.confirm('Jste si jisti, že chcete zrušit tuto rezervaci? ')
        if (confirmDelete && event.id) {
            await deleteBooking(event.id.toString()).then((payload) => payload && handleClose())
        }
    }

    const { data: categories, isLoading: isLoadingCategories } = useGetCategories()

    useEffect(() => {
        if (!isNilOrEmpty(event)) {
            const { start, title: name, resource } = event
            setStartValue(start)
            setCompletedValue(resource?.completed ?? false)
            // setPrecautionaryInspectionValue(equals(resource?.category, 2))
            reset({
                start: getISODateStringWithCorrectOffset(start),
                name: name?.split(' - ')[0],
                birthdate: name?.split(' - ')[1],
                phone: isNilOrEmpty(resource?.phone) ? 'Nevyplněno' : resource?.phone,
                email: isNilOrEmpty(resource?.email) ? 'Nevyplněno' : resource?.email,
                completed: resource?.completed,
                category: resource?.category,
                note: resource?.note ?? '',
                selectedDoctorId: resource?.selectedDoctorId ?? '',
            })
        }
    }, [event, reset])

    return (
        <Dialog maxWidth="sm" open={!isNilOrEmpty(event)} onClose={handleClose} disableScrollLock fullWidth>
            <DialogTitle>Detail</DialogTitle>
            <DialogContent sx={{ display: 'grid', gap: 1 }}>
                <Controller
                    name="start"
                    control={control}
                    render={({ field }) => (
                        <MobileDateTimePicker
                            key="start"
                            label="Začátek rezervace"
                            // variant="dialog"
                            format="dd-MM-yyyy HH:mm"
                            value={startValue}
                            sx={{
                                '& .MuiPickersToolbar-penIconButton': {
                                    display: 'none',
                                },
                            }}
                            onChange={(date: Date | null) => {
                                field.onChange(date)
                                setStartValue(date)
                                date &&
                                    setValue('start', getISODateStringWithCorrectOffset(date), {
                                        shouldDirty: true,
                                    })
                            }}
                            ampm={false}
                            minutesStep={Number(import.meta.env.VITE_APPOINTMENT_DURATION)}
                        />
                    )}
                />
                <FormInput label="Jméno" control={control} name="name" fullWidth />
                <FormInput
                    label="Datum narození"
                    placeholder="RRRR-MM-DD"
                    control={control}
                    name="birthdate"
                    fullWidth
                />
                <FormInput
                    label="Telefonní číslo"
                    placeholder="Telefonní číslo"
                    control={control}
                    name="phone"
                    fullWidth
                    disabled
                />
                <FormInput
                    label="E-mail"
                    placeholder="E-mail"
                    control={control}
                    name="email"
                    fullWidth
                    disabled
                />
                <FormSelectInput
                    sx={{ marginTop: 0.5 }}
                    label="Typ vyšetření"
                    name="category"
                    control={control}
                    fullWidth
                >
                    {!isLoadingCategories &&
                        map(
                            ({ label, value }) => (
                                <MenuItem key={label} value={value}>
                                    {label}
                                </MenuItem>
                            ),
                            makeArrayOfLabelValue('name', 'category_id', categories ?? []),
                        )}
                </FormSelectInput>
                <FormInput
                    label="Preferovaný doktor"
                    placeholder="Preferovaný doktor"
                    control={control}
                    name="selectedDoctorId"
                    disabled
                    fullWidth
                />
                <FormInput
                    label="Poznámka (pouze interní)"
                    placeholder="Poznámka"
                    control={control}
                    name="note"
                    multiline
                    rows={5}
                    fullWidth
                />
                <FormControlLabel
                    label="Dokončená objednávka"
                    control={
                        <Checkbox
                            color="primary"
                            name="completed"
                            checked={!!completedValue}
                            onChange={(e) => {
                                setCompletedValue((prevState) => !prevState)
                                setValue('completed', e.target.checked, { shouldDirty: true })
                            }}
                        />
                    }
                />
            </DialogContent>

            {updatingBooking || deletingBooking ? (
                <LinearProgress />
            ) : (
                <DialogActions>
                    <DialogButtons
                        onSecondaryClick={handleClose}
                        secondaryLabel="Zavřit"
                        primaryLabel="Odeslat"
                        onPrimaryClick={handleSubmit(handlePatchBooking)}
                        additionalActionComponent={
                            <Button variant="contained" onClick={handleDeleteBooking} color="primary">
                                <Delete />
                            </Button>
                        }
                        disabledPrimary={!isDirty}
                    />
                </DialogActions>
            )}
        </Dialog>
    )
}

AdministrationEventDetail.propTypes = {
    event: PropTypes.object,
    handleClose: PropTypes.func,
}

export default AdministrationEventDetail
