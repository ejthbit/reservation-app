import { zodResolver } from '@hookform/resolvers/zod'
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
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { isNilOrEmpty } from '../../../../utils'
import { checkArrayStartEndValues } from '../utils/Services/validations'
import AdministrationServicesTableDoctorAssign from './AdministrationServicesTableDoctorAssign'
import { AmbulanceServiceDay } from '../../../../types/AmbulanceService'
import { useDoctorServices, useGetDoctorsForSelectedAmbulance } from '../../../../hooks'
import { useAdministration } from '../../../../context/Administration/AdministrationProvider'

export const StyledCell = styled(TableCell)(() => ({
    borderBottom: 'none',
}))

export const StyledHeaderCell = styled(TableCell)(() => ({
    borderBottom: 'none',
    color: 'white',
    fontWeight: 'bold',
}))

const doctorSchema = z.object({
    doctorId: z.string().optional(),
    start: z.string().optional().default(''),
    end: z.string().optional().default(''),
    note: z.string().optional().default(''),
    id: z.string().optional(),
})

const doctorsArraySchema = z.array(doctorSchema).superRefine((doctors, ctx) => {
    doctors.forEach((doctor, index) => {
        // start required if end is set
        if (doctor.end && !doctor.start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Zadaná hodnota musí být vyplněna!',
                path: [index, 'start'],
            })
        }
        // end required if start is set
        if (doctor.start && !doctor.end) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Zadaná hodnota musí být vyplněna!',
                path: [index, 'end'],
            })
        }
        // start must be before end
        if (doctor.start && doctor.end && !isNilOrEmpty(doctor.end)) {
            if (new Date(doctor.start) >= new Date(doctor.end)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Zadaná hodnota musí být menší než hodnota `Do`!',
                    path: [index, 'start'],
                })
            }
        }
        if (doctor.end && doctor.start && !isNilOrEmpty(doctor.start)) {
            if (new Date(doctor.end) <= new Date(doctor.start)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Zadaná hodnota musí být vetší než hodnota`Od`!',
                    path: [index, 'end'],
                })
            }
        }
        // start must be greater than previous doctor's end
        if (index >= 1 && !isNilOrEmpty(doctor.start)) {
            const prev = doctors[index - 1]!
            if (doctor.start < prev.end) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Hodnota musí být vetší než hodnota `Do` předchozího záznamu.',
                    path: [index, 'start'],
                })
            }
        }
    })
})

const validationSchema = z.object({
    data: z.array(
        z.object({
            date: z.string().optional(),
            doctors: doctorsArraySchema,
        }),
    ),
})
type ServicesTableProps = {
    data: AmbulanceServiceDay[]
    selectedMonth: string
    isEditingServices: boolean
    selectedWorkplaceId: string | number
}
const ServicesTable = ({
    data,
    selectedMonth,
    isEditingServices,
    selectedWorkplaceId,
}: ServicesTableProps) => {
    const {
        api: { createServiceForMonth, updateServiceForMonth },
    } = useDoctorServices()

    const { selectedWorkspace: selectedAmbulanceId } = useAdministration()
    const {
        doctorsForSelectedAmbulance,
        isLoadingDoctorsForSelectedAmbulance: isLoadingDoctors,
        api: { getDoctorsForSelectedAmbulance },
    } = useGetDoctorsForSelectedAmbulance()

    useEffect(() => {
        getDoctorsForSelectedAmbulance(parseInt(selectedAmbulanceId))
    }, [selectedAmbulanceId])

    const {
        handleSubmit,
        control,
        setValue,
        reset,
        trigger,
        formState: { isValid },
    } = useForm({
        mode: 'onChange',
        resolver: zodResolver(validationSchema),
        reValidateMode: 'onChange',
        defaultValues: { data },
    })
    const { fields } = useFieldArray({
        name: 'data',
        control,
    })
    const { enqueueSnackbar } = useSnackbar()
    const onSubmit = async ({ data }: Pick<ServicesTableProps, 'data'>) => {
        const apiData = {
            month: selectedMonth,
            days: data,
            workplace: selectedWorkplaceId,
        }
        try {
            !isEditingServices
                ? await createServiceForMonth(apiData)
                : await updateServiceForMonth(apiData)
            enqueueSnackbar('Rozpis byl úspěšně uložen.', { variant: 'success' })
        } catch (err) {
            enqueueSnackbar('Nastala chyba při ukládání.', { variant: 'error' })
        }
    }

    useEffect(() => {
        reset({ data })
        trigger()
    }, [data])

    if (isLoadingDoctors || !doctorsForSelectedAmbulance) return null

    return (
        <Fade in timeout={{ enter: 500 }}>
            <TableContainer
                component={Paper}
                sx={{
                    width: '100%',
                    marginTop: 2,
                    marginBottom: 2,
                    boxShadow: 0,
                    bgcolor: '#F9F9FB',
                }}
            >
                <Table size="medium">
                    <TableHead
                        sx={(theme) => ({
                            color: 'white',
                            background: `linear-gradient(to right, #6A11CB, #2575FC)`,
                            padding: theme.spacing(2),
                            fontWeight: 600,
                        })}
                    >
                        <TableRow>
                            <StyledHeaderCell rowSpan={2} width="8%">
                                Den
                            </StyledHeaderCell>
                            <StyledHeaderCell rowSpan={2} width="12%">
                                Datum
                            </StyledHeaderCell>
                            <StyledHeaderCell align="center" rowSpan={1} colSpan={8}>
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
                                                doctors={doctorsForSelectedAmbulance}
                                                isLoadingDoctors={isLoadingDoctors}
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
                        sx={{
                            background: `linear-gradient(to right, #6A11CB, #2575FC)`,
                        }}
                    >
                        Uložit
                    </Button>
                </Box>
            </TableContainer>
        </Fade>
    )
}

export default ServicesTable
