import { yupResolver } from '@hookform/resolvers/yup'
import {
    Box,
    Button,
    Fade,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { format } from 'date-fns'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
    useCreateServiceForMonthMutation,
    useUpdateServiceForMonthMutation,
} from '../../../../store/reservationProcess'
import { isNilOrEmpty, isSuccess } from '../../../../utils'
import AdministrationServicesTableDoctorAssign from './AdministrationServicesTableDoctorAssign'

export const StyledCell = styled(TableCell)(() => ({
    borderBottom: 'none',
}))

export const getTimeValuesToFilterOut = (rowArray, originalArray = [], currentValue) => {
    const deepCopy = [...rowArray]
    const newArray = deepCopy.reduce((acc, { start, end }) => {
        if (!isNilOrEmpty(start) && !isNilOrEmpty(end)) acc.push([start, end])
        return acc
    }, [])

    const timeArray = newArray.map(([start, end]) => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        const startHours = (startDate.getHours() - 1).toString().padStart(2, '0')
        const startMinutes = startDate.getMinutes().toString().padStart(2, '0')
        const endHours = (endDate.getHours() - 1).toString().padStart(2, '0')
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0')
        return [`${startHours}:${startMinutes}`, `${endHours}:${endMinutes}`]
    })
    const updatedTimeArray = timeArray.map(([start, end]) => {
        let startTime = new Date('1970-01-01 ' + start + ':00')
        let endTime = new Date('1970-01-01 ' + end + ':00')
        let hours = []
        for (let time = startTime; time < endTime; time.setHours(time.getHours() + 1)) {
            let hour = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            hours.push(hour)
        }
        return [start, ...hours]
    })
    const result = updatedTimeArray

    let flattenedArray = result.reduce(function (accumulator, currentArray) {
        return accumulator.concat(currentArray)
    }, [])

    return originalArray.filter((time) => !flattenedArray.includes(time))
}
const validationSchema = yup.object().shape({
    data: yup.array(
        yup.object().shape({
            doctors: yup.array(
                yup.lazy(() =>
                    yup.object().shape({
                        doctorId: yup.string(),
                        start: yup
                            .string()
                            .test('start', 'Začátek musí být menší než konec!', function (value) {
                                const endDate = new Date(this.parent.end)
                                const startDate = new Date(value)
                                if (isNilOrEmpty(value)) return true
                                return !isNilOrEmpty(this.parent.end) ? startDate < endDate : true
                            }),
                        end: yup
                            .string()
                            .test('dateTest', 'Konec musí být vetší než začátek!', function (value) {
                                const endDate = new Date(value)
                                const startDate = new Date(this.parent.start)
                                if (isNilOrEmpty(value)) return true
                                return !isNilOrEmpty(this.parent.start) ? startDate < endDate : true
                            }),
                        note: yup.string().notRequired(),
                    })
                )
            ),
        })
    ),
})
const ServicesTable = ({ data, selectedMonth, isEditingServices, selectedWorkplaceId }) => {
    const [createService] = useCreateServiceForMonthMutation()
    const [updateService] = useUpdateServiceForMonthMutation()

    const { handleSubmit, control, setValue, reset, trigger } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),

        reValidateMode: 'onChange',
        defaultValues: { data },
    })
    const { fields } = useFieldArray({ name: 'data', control, shouldUnregister: true })
    const { enqueueSnackbar } = useSnackbar()

    const onSubmit = async ({ data }) => {
        // const withoutClosingItems = data.map((item) => {
        //     if (isNilOrEmpty(item.doctors))
        //         item.doctors = [
        //             {
        //                 doctorId: '',
        //                 start: '',
        //                 end: '',
        //                 note: '',
        //             },
        //         ]
        //     return item
        // })
        const apiData = {
            month: selectedMonth,
            days: data,
            workplace: selectedWorkplaceId,
        }
        try {
            const res = !isEditingServices
                ? await createService(apiData).unwrap()
                : await updateService(apiData).unwrap()
            if (isSuccess(res)) {
                enqueueSnackbar('Rozpis byl úspěšně uložen.', { variant: 'success' })
            }
        } catch (err) {
            enqueueSnackbar('Nastala chyba při ukládání.', { variant: 'error' })
        }
    }

    useEffect(() => {
        reset({ data })
    }, [data])

    return (
        <Fade in timeout={{ enter: 500 }}>
            <TableContainer
                component={Paper}
                sx={{
                    width: '100%',
                    marginTop: 2,
                    marginBottom: 2,
                    borderRadius: 2,
                    boxShadow: 0,
                    bgcolor: '#F9F9FB',
                }}
            >
                <Table size="medium">
                    <TableHead
                        sx={(theme) => ({
                            padding: theme.spacing(2),
                            fontWeight: 600,
                        })}
                    >
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
                            <TableRow key={id}>
                                <TableCell width="10%">
                                    {new Date(date).toLocaleString('cs-CZ', { weekday: 'long' })}
                                </TableCell>
                                <TableCell width="10%">{format(new Date(date), 'dd-MM-yyyy')}</TableCell>
                                <TableCell colSpan={8} sx={{ padding: 0 }}>
                                    <Table>
                                        <TableBody>
                                            {doctors.length === 0 && (
                                                <TableRow>
                                                    <StyledCell>Zavřeno</StyledCell>
                                                </TableRow>
                                            )}
                                            <AdministrationServicesTableDoctorAssign
                                                control={control}
                                                date={date}
                                                setValue={setValue}
                                                idx={idx}
                                                trigger={trigger}
                                            />
                                        </TableBody>
                                    </Table>
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
