import { Delete } from '@mui/icons-material'
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextField,
} from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers'
import { addMinutes } from 'date-fns'
import { equals } from 'ramda'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getISODateStringWithCorrectOffset, isNilOrEmpty } from '../../../../utils'
import { DialogButtons, Dropdown, FormInput } from '../../../common'
import PropTypes from 'prop-types'
import { useUpdateBookingMutation } from '../../../../store/administration/services'
import { useLazyGetBookingCategoriesQuery } from '../../../../store/reservationProcess'

const AdministrationEventDetail = ({ event, handleClose }) => {
    const [startValue, setStartValue] = useState(null)
    const [completedValue, setCompletedValue] = useState(false)
    const [precautionaryInspectionValue, setPrecautionaryInspectionValue] = useState(false)
    const [updateBooking] = useUpdateBookingMutation()

    const { control, handleSubmit, reset, formState, setValue } = useForm({
        defaultValues: {
            start: '',
            end: '',
            name: '',
            birthdate: '',
            phone: '',
            completed: completedValue,
        },
    })
    const { isDirty } = formState
    const handlePatchBooking = async (updatedBooking) => {
        await updateBooking({
            id: event.id,
            end: addMinutes(new Date(updatedBooking.start), 15).toISOString(),
            ...updatedBooking,
        })
            .unwrap()
            .then(handleClose())
    }
    // TODO bookingAPI
    // const handleDeleteBooking = async () => {
    //     const confirmDelete = window.confirm('Jste si jisti, že chcete zrušit tuto rezervaci? ')
    //     if (confirmDelete) {
    //         const { error } = await dispatch(deleteBooking(event.id))
    //         if (!error) handleClose()
    //     }
    // }

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
                completed: resource?.completed,
            })
        }
    }, [event, reset])

    return (
        <Dialog maxWidth="sm" open={!isNilOrEmpty(event)} onClose={handleClose} disableScrollLock fullWidth>
            <DialogTitle>Detail</DialogTitle>
            <DialogContent sx={{ display: 'grid', gap: 1 }}>
                {/* <TimePicker
                    id="start"
                    label="Začátek rezervace"
                    variant="dialog"
                    inputFormat="dd-MM-yyyy HH:mm"
                    views={['hours', 'minutes']}
                    openTo="hours"
                    mask="__-__-____ __:__"
                    value={startValue}
                    name="start"
                    onChange={(date) => {
                        setStartValue(date)
                        setValue('start', getISODateStringWithCorrectOffset(date), {
                            shouldDirty: true,
                        })
                    }}
                    renderInput={(params) => <TextField {...params} variant="standard" required />}
                    ampm={false}
                    minutesStep={15}
                /> */}
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
                    disabled={true ?? !!control.defaultValuesRef.current.phone}
                />
                <FormControlLabel
                    label="Dokončená objednávka"
                    control={
                        <Checkbox
                            color="primary"
                            name="completed"
                            checked={completedValue}
                            onChange={(e) => {
                                setCompletedValue((prevState) => !prevState)
                                setValue('completed', e.target.checked, { shouldDirty: true })
                            }}
                        />
                    }
                />

                <Dropdown
                    label="Typ vyšetření"
                    isLoading={isLoading}
                    value={event?.resource?.category}
                    options={categories}
                    disabled
                />
            </DialogContent>
            <DialogActions>
                <DialogButtons
                    onSecondaryClick={handleClose}
                    secondaryLabel="Zavřit"
                    primaryLabel="Odeslat"
                    onPrimaryClick={handleSubmit(handlePatchBooking)}
                    // additionalActionComponent={
                    //     <Button
                    //         className={classes.btnItem}
                    //         variant="contained"
                    //         onClick={handleDeleteBooking}
                    //         color="primary"
                    //     >
                    //         <Delete />
                    //     </Button>
                    // }
                    disabledPrimary={!isDirty}
                />
            </DialogActions>
        </Dialog>
    )
}

AdministrationEventDetail.propTypes = {
    event: PropTypes.object,
    handleClose: PropTypes.func,
}

export default AdministrationEventDetail
