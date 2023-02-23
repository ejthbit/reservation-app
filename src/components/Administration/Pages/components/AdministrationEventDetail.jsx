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
    TextField,
} from '@mui/material'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { addMinutes } from 'date-fns'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDeleteBookingMutation, useUpdateBookingMutation } from '../../../../store/administration/services'
import { useLazyGetBookingCategoriesQuery } from '../../../../store/reservationProcess'
import { getISODateStringWithCorrectOffset, isNilOrEmpty } from '../../../../utils'
import { DialogButtons, Dropdown, FormInput } from '../../../common'

const AdministrationEventDetail = ({ event, handleClose }) => {
    const [startValue, setStartValue] = useState(null)
    const [completedValue, setCompletedValue] = useState(false)
    const [updateBooking, { isLoading: updatingBooking }] = useUpdateBookingMutation()
    const [deleteBooking, { isLoading: deletingBooking }] = useDeleteBookingMutation()

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
            phone: '',
            email: '',
            note: '',
            completed: !!completedValue,
        },
    })
    const handlePatchBooking = async (updatedBooking) => {
        await updateBooking({
            id: event.id,
            end: addMinutes(
                new Date(updatedBooking.start),
                import.meta.env.VITE_APPOINTMENT_DURATION
            ).toISOString(),
            ...updatedBooking,
        })
            .unwrap()
            .then((payload) => payload && handleClose())
    }
    const handleDeleteBooking = async () => {
        const confirmDelete = window.confirm('Jste si jisti, že chcete zrušit tuto rezervaci? ')
        if (confirmDelete) {
            await deleteBooking(event.id)
                .unwrap()
                .then((payload) => payload && handleClose())
        }
    }

    const [getReservationCategories, { currentData: categories, isLoading }] =
        useLazyGetBookingCategoriesQuery()

    useEffect(() => {
        if (isNilOrEmpty(categories)) getReservationCategories()
    }, [categories])

    useEffect(() => {
        if (!isNilOrEmpty(event)) {
            const { start, title: name, resource } = event
            setStartValue(start)
            setCompletedValue(resource?.completed)
            // setPrecautionaryInspectionValue(equals(resource?.category, 2))
            reset({
                start: getISODateStringWithCorrectOffset(start),
                name: name.split(' - ')[0],
                birthdate: name.split(' - ')[1],
                phone: isNilOrEmpty(resource?.phone) ? 'Nevyplněno' : resource?.phone,
                email: isNilOrEmpty(resource?.email) ? 'Nevyplněno' : resource?.email,
                completed: resource?.completed,
                note: resource?.note,
            })
        }
    }, [event, reset])

    return (
        <Dialog maxWidth="sm" open={!isNilOrEmpty(event)} onClose={handleClose} disableScrollLock fullWidth>
            <DialogTitle>Detail</DialogTitle>
            <DialogContent sx={{ display: 'grid', gap: 1 }}>
                <MobileDateTimePicker
                    id="start"
                    label="Začátek rezervace"
                    variant="dialog"
                    inputFormat="dd-MM-yyyy HH:mm"
                    mask="__-__-____ __:__"
                    value={startValue}
                    name="start"
                    sx={{
                        '& .MuiPickersToolbar-penIconButton': {
                            display: 'none',
                        },
                    }}
                    onChange={(date) => {
                        setStartValue(date)
                        setValue('start', getISODateStringWithCorrectOffset(date), {
                            shouldDirty: true,
                        })
                    }}
                    renderInput={(params) => <TextField {...params} variant="standard" required />}
                    ampm={false}
                    minutesStep={Number(import.meta.env.VITE_APPOINTMENT_DURATION)}
                />
                <FormInput label="Jméno" control={control} name="name" fullWidth />
                <FormInput
                    label="Datum narození"
                    placeholder="RRRR-MM-DD"
                    control={control}
                    name="birthdate"
                    fullWidth
                    disabled
                />
                <FormInput
                    label="Telefonní číslo"
                    placeholder="Telefonní číslo"
                    control={control}
                    name="phone"
                    fullWidth
                    disabled={true ?? !!control.defaultValuesRef.current.phone}
                />
                <FormInput
                    label="E-mail"
                    placeholder="E-mail"
                    control={control}
                    name="email"
                    fullWidth
                    disabled={true ?? !!control.defaultValuesRef.current.email}
                />
                <Dropdown
                    label="Typ vyšetření"
                    isLoading={isLoading}
                    value={event?.resource?.category}
                    options={categories}
                    disabled
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
