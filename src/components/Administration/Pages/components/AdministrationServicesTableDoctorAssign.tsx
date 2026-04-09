import { MenuItem, TableRow, useTheme } from '@mui/material'
import { Control, useFieldArray, UseFormSetValue, UseFormTrigger } from 'react-hook-form'
import { getHalfHourTimeIncrements } from '../../../../utils'
import { FormInput, FormSelectInput } from '../../../common'
import { getTimeValuesToFilterOut } from '../utils/Services/utils'
import AdministrationServicesEntryMenu from './AdministrationServicesEntryMenu'
import { StyledCell } from './AdministrationServicesTable'
import { AmbulanceServiceDay, DoctorService } from '../../../../types/AmbulanceService'
import { Doctor } from '../../../../types/Doctor'

type AdministrationServicesTableDoctorAssignProps = {
    idx: number
    control: Control<
        {
            data: AmbulanceServiceDay[]
        },
        any
    >
    setValue: UseFormSetValue<{
        data: AmbulanceServiceDay[]
    }>
    date: string
    trigger: UseFormTrigger<{
        data: AmbulanceServiceDay[]
    }>
    doctors?: Doctor[]
    isLoadingDoctors: boolean
}

const openingHours = getHalfHourTimeIncrements('07:00', '19:00') // TODO: use env variable
const AdministrationServicesTableDoctorAssign = ({
    idx,
    control,
    setValue,
    date,
    trigger,
    doctors: doctorsForSelectedAmbulance,
    isLoadingDoctors: isLoading,
}: AdministrationServicesTableDoctorAssignProps) => {
    const theme = useTheme()

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: `data.${idx}.doctors`,
    })
    const handleRemoveDoctorFromDay = (doctorIndex: number) => remove(doctorIndex)

    const handleAssignDoctorToDay = () => {
        append({
            doctorId: '',
            start: '',
            end: '',
            note: '',
        } as DoctorService)
        trigger(`data.${idx}.doctors`)
    }

    const handleUpdateFieldValue = (doctorIndex: number, property: string, value: string) =>
        update(doctorIndex, {
            ...fields[doctorIndex],
            [`fields[${doctorIndex}][${property}]`]: value,
        } as DoctorService)

    return fields.map(({ id, start }, index) => (
        <TableRow key={id}>
            <StyledCell sx={{ width: fields.some(({ doctorId }) => doctorId !== '') ? '25%' : '75%' }}>
                <FormSelectInput
                    name={`data.${idx}.doctors.${index}.doctorId`}
                    control={control}
                    fullWidth
                    required
                    displayEmpty
                    // className={{
                    //     [theme.breakpoints.up('md')]: {
                    //         width: '270px',
                    //     },
                    // }}
                    isLoading={isLoading}
                >
                    <MenuItem
                        value=""
                        onClick={() => {
                            setValue(`data.${idx}.doctors.${index}.start`, '')
                            setValue(`data.${idx}.doctors.${index}.end`, '')
                        }}
                    >
                        Zavřeno
                    </MenuItem>
                    {doctorsForSelectedAmbulance &&
                        doctorsForSelectedAmbulance.map(({ doctor_id, name }) => (
                            <MenuItem
                                key={doctor_id}
                                value={doctor_id}
                                onClick={(e) =>
                                    handleUpdateFieldValue(index, 'doctorId', doctor_id /* e.target.value */)
                                }
                            >
                                {name}
                            </MenuItem>
                        ))}
                </FormSelectInput>
            </StyledCell>
            {fields.some(({ doctorId }) => doctorId !== '') && (
                <>
                    <StyledCell sx={{ width: '10%' }}>
                        <FormSelectInput
                            name={`data.${idx}.doctors.${index}.start`}
                            control={control}
                            fullWidth
                            required
                        >
                            {(fields.length > 1 && start == ''
                                    ? getTimeValuesToFilterOut(fields, openingHours)
                                    : openingHours
                            ).map((entry) => (
                                    <MenuItem
                                        key={entry}
                                        value={`${date}T${entry}:00.000Z`}
                                        onClick={(e) => {
                                            trigger(`data.${idx}.doctors.${index}.end`)
                                            return handleUpdateFieldValue(
                                                index,
                                                'start',
                                                `${date}T${entry}:00.000Z`,
                                            )
                                        }}
                                    >
                                        {entry}
                                    </MenuItem>
                                ))}
                        </FormSelectInput>
                    </StyledCell>
                    <StyledCell sx={{ width: '10%' }}>
                        <FormSelectInput
                            name={`data.${idx}.doctors.${index}.end`}
                            control={control}
                            fullWidth
                            required
                        >
                            {openingHours.map((entry) => (
                                    <MenuItem
                                        key={entry}
                                        value={`${date}T${entry}:00.000Z`}
                                        onClick={(e) => {
                                            trigger(`data.${idx}.doctors.${index}.start`)
                                            return handleUpdateFieldValue(
                                                index,
                                                'end',
                                                `${date}T${entry}:00.000Z`,
                                            )
                                        }}
                                    >
                                        {entry}
                                    </MenuItem>
                                ))}
                        </FormSelectInput>
                    </StyledCell>
                    <StyledCell sx={{ width: '30%' }}>
                        <FormInput name={`data.${idx}.doctors.${index}.note`} control={control} fullWidth />
                    </StyledCell>
                </>
            )}
            <StyledCell sx={{ width: '5%' }}>
                <AdministrationServicesEntryMenu
                    onAssign={() => handleAssignDoctorToDay()}
                    onDelete={() => handleRemoveDoctorFromDay(index)}
                    disabled={fields.length <= 1}
                    disabledAdd={fields.length === doctorsForSelectedAmbulance?.length}
                />
            </StyledCell>
        </TableRow>
    ))
}

export default AdministrationServicesTableDoctorAssign
