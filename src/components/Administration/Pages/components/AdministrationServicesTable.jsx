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
import { checkArrayStartEndValues } from '../utils/Services/validations'
import AdministrationServicesTableDoctorAssign from './AdministrationServicesTableDoctorAssign'

export const StyledCell = styled(TableCell)(() => ({
    borderBottom: 'none',
}))

export const StyledHeaderCell = styled(TableCell)(() => ({
    borderBottom: 'none',
    color: 'white',
    fontWeight: 'bold',
}))

const validationSchema = yup.object().shape({
    data: yup.array(
        yup.object().shape({
            doctors: yup.array(
                yup.lazy(() =>
                    yup.object().shape({
                        start: yup
                            .string()
                            .test('start-required', 'Zadaná hodnota musí být vyplněna!', function (value) {
                                return !isNilOrEmpty(this.parent.end)
                                    ? !isNilOrEmpty(this.parent.end) && value
                                    : true
                            })
                            .test(
                                'start',
                                'Zadaná hodnota musí být menší než hodnota `Do`!',
                                function (value) {
                                    const endDate = new Date(this.parent.end)
                                    const startDate = new Date(value)
                                    if (isNilOrEmpty(value)) return true
                                    return !isNilOrEmpty(this.parent.end) ? startDate < endDate : true
                                }
                            )
                            .test(
                                'isGreater',
                                'Hodnota musí být vetší než hodnota `Do` předchozího záznamu.',
                                checkArrayStartEndValues
                            ),
                        end: yup
                            .string()
                            .test('end-required', 'Zadaná hodnota musí být vyplněna!', function (value) {
                                return !isNilOrEmpty(this.parent.start)
                                    ? !isNilOrEmpty(this.parent.start) && value
                                    : true
                            })
                            .test('end', 'Zadaná hodnota musí být vetší než hodnota`Od`!', function (value) {
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

    const {
        handleSubmit,
        control,
        setValue,
        reset,
        trigger,
        formState: { isValid },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
        reValidateMode: 'onChange',
        defaultValues: { data },
    })
    const { fields } = useFieldArray({
        name: 'data',
        control,
    })
    const { enqueueSnackbar } = useSnackbar()
    const onSubmit = async ({ data }) => {
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
        trigger()
    }, [data])

    return (
        <Fade in timeout={{ enter: 500 }}>
            <TableContainer
                component={Paper}
                sx={{
                    width: '100%',
                    marginTop: 2,
                    marginBottom: 2,
                    borderRadius: 6,
                    boxShadow: 0,
                    bgcolor: '#F9F9FB',
                }}
            >
                <Table size="medium">
                    <TableHead
                        sx={(theme) => ({
                            color: 'white',
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 6,
                            padding: theme.spacing(2),
                            fontWeight: 600,
                        })}
                    >
                        <TableRow>
                            <StyledHeaderCell rowSpan="2" width="8%">
                                Den
                            </StyledHeaderCell>
                            <StyledHeaderCell rowSpan="2" width="12%">
                                Datum
                            </StyledHeaderCell>
                            <StyledHeaderCell align="center" rowSpan="1" colSpan="8">
                                Seznam doktorů
                            </StyledHeaderCell>
                        </TableRow>
                        <TableRow>
                            <StyledHeaderCell width="25%">Doktor</StyledHeaderCell>
                            <StyledHeaderCell width="10%" align="center">
                                Od
                            </StyledHeaderCell>
                            <StyledHeaderCell width="10%" align="center">
                                Do
                            </StyledHeaderCell>
                            <StyledHeaderCell align="center" width="30%">
                                Poznámka
                            </StyledHeaderCell>
                            <StyledHeaderCell align="center" width="5%">
                                Akce
                            </StyledHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fields.map(({ date, doctors, id }, idx) => (
                            <TableRow key={id}>
                                <TableCell width="8%">
                                    {new Date(date).toLocaleString('cs-CZ', { weekday: 'long' })}
                                </TableCell>
                                <TableCell width="12%">{format(new Date(date), 'dd-MM-yyyy')}</TableCell>
                                <TableCell width="80%" colSpan={8} sx={{ padding: 0 }}>
                                    <Table padding="checkbox">
                                        <TableBody>
                                            {doctors.length === 0 && (
                                                <TableRow>
                                                    <StyledCell width="80%">Zavřeno</StyledCell>
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
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                        disabled={!isValid}
                        sx={{ borderRadius: 6 }}
                    >
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
