import { MenuItem, TableRow, useTheme } from '@mui/material'
import { map, values } from 'ramda'
import { useFieldArray } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { getUserConfigurationSelectedAmbulance } from '../../../../store/administration'
import { useGetDoctorsForSelectedAmbulanceQuery } from '../../../../store/reservationProcess'
import { getHalfHourTimeIncrements } from '../../../../utils'
import { FormInput, FormSelectInput } from '../../../common'
import { getTimeValuesToFilterOut } from '../utils/Services/utils'
import AdministrationServicesEntryMenu from './AdministrationServicesEntryMenu'
import { StyledCell } from './AdministrationServicesTable'

const openingHours = getHalfHourTimeIncrements('07:00', '19:00') // TODO: use env variable
const AdministrationServicesTableDoctorAssign = ({ idx, control, setValue, date, trigger }) => {
    const theme = useTheme()
    const selectedAmbulanceId = useSelector(getUserConfigurationSelectedAmbulance)

    const { currentData: doctorsForSelectedAmbulance, isFetching } =
        useGetDoctorsForSelectedAmbulanceQuery(selectedAmbulanceId)
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: `data[${idx}].doctors`,
    })
    const handleRemoveDoctorFromDay = (doctorIndex) => remove(doctorIndex)

    const handleAssignDoctorToDay = () => {
        append({
            doctorId: '',
            start: '',
            end: '',
            note: '',
        })
        trigger(`data.${idx}.doctors`)
    }

    const handleUpdateFieldValue = (doctorIndex, property, value) =>
        update(doctorIndex, { ...fields[doctorIndex], [`fields[${doctorIndex}][${property}]`]: value })

    return fields.map(({ id, start }, index) => (
        <TableRow key={id}>
            <StyledCell sx={{ width: fields.some(({ doctorId }) => doctorId !== '') ? '25%' : '75%' }}>
                <FormSelectInput
                    name={`data.${idx}.doctors.${index}.doctorId`}
                    control={control}
                    fullWidth
                    required
                    displayEmpty
                    className={{
                        [theme.breakpoints.up('md')]: {
                            width: '270px',
                        },
                    }}
                    isLoading={isFetching}
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
                    {map(
                        ({ value, label }) => (
                            <MenuItem
                                key={value}
                                value={value}
                                onClick={(e) => handleUpdateFieldValue(index, 'doctorId', e.target.value)}
                            >
                                {label}
                            </MenuItem>
                        ),
                        values(doctorsForSelectedAmbulance)
                    )}
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
                            {map(
                                (entry) => (
                                    <MenuItem
                                        key={entry}
                                        value={`${date}T${entry}:00.000Z`}
                                        onClick={(e) => {
                                            trigger(`data.${idx}.doctors.${index}.end`)
                                            return handleUpdateFieldValue(index, 'start', e.target.value)
                                        }}
                                    >
                                        {entry}
                                    </MenuItem>
                                ),
                                fields.length > 1 && start == ''
                                    ? getTimeValuesToFilterOut(fields, openingHours)
                                    : openingHours
                            )}
                        </FormSelectInput>
                    </StyledCell>
                    <StyledCell sx={{ width: '10%' }}>
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
                                        onClick={(e) => {
                                            trigger(`data.${idx}.doctors.${index}.start`)
                                            return handleUpdateFieldValue(index, 'end', e.target.value)
                                        }}
                                    >
                                        {entry}
                                    </MenuItem>
                                ),
                                openingHours
                            )}
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

AdministrationServicesTableDoctorAssign.propTypes = {}

export default AdministrationServicesTableDoctorAssign
