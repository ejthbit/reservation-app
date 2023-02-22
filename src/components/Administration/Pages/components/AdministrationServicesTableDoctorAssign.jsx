import { MenuItem, TableRow } from '@mui/material'
import { map, values } from 'ramda'
import { useFieldArray } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { getUserConfigurationSelectedAmbulance } from '../../../../store/administration'
import { useGetDoctorsForSelectedAmbulanceQuery } from '../../../../store/reservationProcess'
import { FormInput, FormSelectInput } from '../../../common'
import AdministrationServicesEntryMenu from './AdministrationServicesEntryMenu'
import { getTimeValuesToFilterOut, StyledCell } from './AdministrationServicesTable'

const openingHours = Array(24)
    .fill(0)
    .map((_, i) => {
        return ('0' + i + ':0' + 60 * (i % 1)).replace(/\d(\d\d)/g, '$1')
    })
const AdministrationServicesTableDoctorAssign = ({ idx, control, setValue, date, trigger }) => {
    const selectedAmbulanceId = useSelector(getUserConfigurationSelectedAmbulance)

    const { currentData: doctorsForSelectedAmbulance, isFetching } =
        useGetDoctorsForSelectedAmbulanceQuery(selectedAmbulanceId)
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: `data[${idx}].doctors`,
    })
    const handleRemoveDoctorFromDay = (doctorIndex) => remove(doctorIndex)

    const handleAssignDoctorToDay = () =>
        append({
            doctorId: '',
            start: '',
            end: '',
            note: '',
        })

    const handleUpdateFieldValue = (doctorIndex, property, value) =>
        update(doctorIndex, { ...fields[doctorIndex], [`fields[${doctorIndex}][${property}]`]: value })

    return fields.map(({ doctorId, id, start }, index) => (
        <TableRow key={id}>
            <StyledCell>
                <FormSelectInput
                    name={`data.${idx}.doctors.${index}.doctorId`}
                    control={control}
                    fullWidth
                    required
                    displayEmpty
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
            {doctorId !== '' && (
                <>
                    <StyledCell>
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
                    <StyledCell>
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
                    <StyledCell
                        sx={{
                            width: 250,
                            maxWidth: 250,
                        }}
                    >
                        <FormInput name={`data.${idx}.doctors.${index}.note`} control={control} fullWidth />
                    </StyledCell>
                </>
            )}
            <StyledCell
                sx={{
                    width: 50,
                    maxWidth: 50,
                }}
            >
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
