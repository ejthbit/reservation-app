import { Add } from '@mui/icons-material'
import {
    Box,
    Button,
    Fade,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import { format } from 'date-fns'
import PropTypes from 'prop-types'
import { equals, filter, map, values } from 'ramda'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { getUserConfigurationSelectedAmbulance } from '../../../../store/administration'
import {
    useCreateServiceForMonthMutation,
    useGetDoctorsForSelectedAmbulanceQuery,
    useUpdateServiceForMonthMutation,
} from '../../../../store/reservationProcess'
import { FormInput, FormSelectInput } from '../../../common'
import AdministrationServicesEntryMenu from './AdministrationServicesEntryMenu'

const getTimeValuesToFilterOut = (rowArray, originalArray = []) => {
    const newArray = rowArray.map((obj) => [obj.start, obj.end])

    const timeArray = newArray.map(([start, end]) => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const startHours = (startDate.getHours() - 1).toString().padStart(2, '0')
        const startMinutes = startDate.getMinutes().toString().padStart(2, '0')
        const endHours = (endDate.getHours() - 1).toString().padStart(2, '0')
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0')
        return [`${startHours}:${startMinutes}`, `${endHours}:${endMinutes}`]
    })
    // TODO MIDDLE HOURS
    const updatedTimeArray = timeArray.map(([start, end]) => {
        const startTime = start.split(':')
        const endTime = end.split(':')
        const startHours = parseInt(startTime[0], 10)
        const endHours = parseInt(endTime[0], 10)
        let hours = []
        for (let time = startHours / 60; time <= endHours / 60; time += 60) {
            hours.push(Math.floor(time / 60) + ':' + (time % 60))
        }
        return [start, ...hours, end]
    })
    const result = updatedTimeArray

    let flattenedArray = result.reduce(function (accumulator, currentArray) {
        return accumulator.concat(currentArray)
    }, [])
    console.log(flattenedArray, originalArray)

    return originalArray.filter((time) => !flattenedArray.includes(time))
}

const getOpeningHours = () =>
    Array(24)
        .fill(0)
        .map((_, i) => {
            return ('0' + i + ':0' + 60 * (i % 1)).replace(/\d(\d\d)/g, '$1')
        })

const openingHours = getOpeningHours()
const ServicesTable = ({ data, selectedMonth, isEditingServices, selectedWorkplaceId }) => {
    const selectedAmbulanceId = useSelector(getUserConfigurationSelectedAmbulance)
    const { currentData: doctorsForSelectedAmbulance, isFetching } =
        useGetDoctorsForSelectedAmbulanceQuery(selectedAmbulanceId)
    const [createService] = useCreateServiceForMonthMutation()
    const [updateService] = useUpdateServiceForMonthMutation()

    const { handleSubmit, control, setValue, reset, watch } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: { data },
    })
    const formState = watch()?.data
    const { fields, update } = useFieldArray({ name: 'data', control, shouldUnregister: true })
    const handleAssignDoctorToDay = (index) =>
        update(index, {
            ...formState[index],
            doctors: [
                ...formState[index].doctors,
                {
                    doctorId: '',
                    start: '',
                    end: '',
                    note: '',
                },
            ],
        })

    const handleRemoveDoctorFromDay = (rowIndex, doctorIndex) => {
        const id = formState[rowIndex].doctors[doctorIndex]?.doctorId
        const updatedValue = filter(({ doctorId }) => !equals(doctorId, id), formState[rowIndex].doctors)
        return update(rowIndex, {
            ...formState[rowIndex],
            doctors: updatedValue,
        })
    }
    const onSubmit = ({ data }) => {
        const withoutClosingItems = data.map((item) => {
            item.doctors = item.doctors.filter((doctor) => doctor.doctorId !== '')
            return item
        })
        const apiData = {
            month: selectedMonth,
            days: withoutClosingItems,
            workplace: selectedWorkplaceId,
        }
        !isEditingServices ? createService(apiData) : updateService(apiData)
    }

    useEffect(() => {
        reset({ data })
    }, [data])

    return (
        <Fade in timeout={{ enter: 500 }}>
            <TableContainer
                component={Paper}
                sx={{ boxShadow: 'none', width: '100%', marginTop: 2, marginBottom: 2 }}
            >
                <Table size="medium">
                    <TableHead sx={{ borderBottom: '1px solid #e0e0e0', borderTop: '1px solid #e0e0e0' }}>
                        <TableRow>
                            <TableCell rowSpan="2">Den</TableCell>
                            <TableCell rowSpan="2">Datum</TableCell>
                            <TableCell
                                align="center"
                                rowSpan="1"
                                colSpan="8"
                                sx={{ borderBottom: '1px solid #e0e0e0' }}
                            >
                                Seznam doktorů
                            </TableCell>
                            <TableCell rowSpan="2" align="center">
                                Přidělit doktora ke dni
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Doktor</TableCell>
                            <TableCell>Od</TableCell>
                            <TableCell>Do</TableCell>
                            <TableCell align="center" sx={{ width: 250, maxWidth: 250 }}>
                                Poznámka
                            </TableCell>
                            <TableCell align="center" sx={{ width: 50, maxWidth: 50 }}>
                                Akce
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fields.map(({ date, doctors, id }, idx) => (
                            <TableRow
                                key={id}
                                sx={{
                                    borderBottom: '1px solid #e0e0e0',
                                }}
                            >
                                <TableCell width="10%">
                                    {new Date(date).toLocaleString('cs-CZ', { weekday: 'long' })}
                                </TableCell>
                                <TableCell width="10%">{format(new Date(date), 'dd-MM-yyyy')}</TableCell>
                                <TableCell colSpan={8} sx={{ padding: 0 }}>
                                    <Table>
                                        <TableBody>
                                            {doctors.length === 0 && (
                                                <TableRow>
                                                    <TableCell>Zavřeno</TableCell>
                                                </TableRow>
                                            )}
                                            {/*
                                                 TODO: Move to separate component and fix using this issue solution, move onDelete and OnAssign too
                                                https://stackoverflow.com/questions/66727547/reset-nested-array-in-react-hook-form */}
                                            {doctors.map(({ doctorId, start }, index) => (
                                                <TableRow key={`${doctorId}_${index}`}>
                                                    <TableCell>
                                                        <FormSelectInput
                                                            name={`data.${idx}.doctors.${index}.doctorId`}
                                                            control={control}
                                                            fullWidth
                                                            required
                                                            displayEmpty
                                                        >
                                                            {/* Move to day controls */}
                                                            <MenuItem
                                                                value=""
                                                                onClick={() => {
                                                                    setValue(
                                                                        `data.${idx}.doctors.${index}.start`,
                                                                        ''
                                                                    )
                                                                    setValue(
                                                                        `data.${idx}.doctors.${index}.end`,
                                                                        ''
                                                                    )
                                                                }}
                                                            >
                                                                Zavřeno
                                                            </MenuItem>
                                                            {map(
                                                                ({ value, label }) => (
                                                                    <MenuItem key={value} value={value}>
                                                                        {label}
                                                                    </MenuItem>
                                                                ),
                                                                values(doctorsForSelectedAmbulance)
                                                            )}
                                                        </FormSelectInput>
                                                    </TableCell>
                                                    {doctorId !== '' && (
                                                        <>
                                                            <TableCell>
                                                                <FormSelectInput
                                                                    name={`data.${idx}.doctors.${index}.start`}
                                                                    control={control}
                                                                    fullWidth
                                                                    required
                                                                >
                                                                    {map(
                                                                        (entry) => (
                                                                            <MenuItem
                                                                                key={entry}
                                                                                value={`${date}T${entry}:00.000Z`}
                                                                            >
                                                                                {entry}
                                                                            </MenuItem>
                                                                        ),
                                                                        doctors.length > 1 && start === ''
                                                                            ? getTimeValuesToFilterOut(
                                                                                  doctors,
                                                                                  openingHours
                                                                              )
                                                                            : openingHours
                                                                    )}
                                                                </FormSelectInput>
                                                            </TableCell>
                                                            <TableCell>
                                                                <FormSelectInput
                                                                    name={`data.${idx}.doctors.${index}.end`}
                                                                    control={control}
                                                                    fullWidth
                                                                    required
                                                                >
                                                                    {map(
                                                                        (entry) => (
                                                                            <MenuItem
                                                                                key={entry}
                                                                                value={`${date}T${entry}:00.000Z`}
                                                                            >
                                                                                {entry}
                                                                            </MenuItem>
                                                                        ),
                                                                        openingHours
                                                                    )}
                                                                </FormSelectInput>
                                                            </TableCell>
                                                            <TableCell sx={{ width: 250, maxWidth: 250 }}>
                                                                <FormInput
                                                                    name={`data.${idx}.doctors.${index}.note`}
                                                                    control={control}
                                                                    fullWidth
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={{ width: 50, maxWidth: 50 }}>
                                                                <AdministrationServicesEntryMenu
                                                                    onDelete={() =>
                                                                        handleRemoveDoctorFromDay(idx, index)
                                                                    }
                                                                    disabled={doctors.length <= 1}
                                                                />
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        display:
                                            formState[idx].doctors.length <
                                            values(doctorsForSelectedAmbulance).length
                                                ? 'table-cell'
                                                : 'none',
                                    }}
                                >
                                    <Button onClick={() => handleAssignDoctorToDay(idx)}>
                                        <Add />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box margin={1}>
                    <Button color="primary" variant="contained" onClick={handleSubmit(onSubmit)}>
                        Uložit
                    </Button>
                </Box>
            </TableContainer>
        </Fade>
    )
}

ServicesTable.propTypes = {
    data: PropTypes.array,
    selectedMonth: PropTypes.string,
    isEditingServices: PropTypes.bool,
    selectedWorkplaceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default ServicesTable
