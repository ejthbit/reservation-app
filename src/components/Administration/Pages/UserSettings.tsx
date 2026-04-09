import { Box, MenuItem } from '@mui/material'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { makeArrayOfLabelValue } from '../../../context/Reservation/ReservationHelpers'
import { useUser } from '../../../context/User/UserProvider'
import { useGetAmbulances } from '../../../hooks/useGetAmbulances'
import { isNilOrEmpty } from '../../../utils'
import { FormInput, FormSelectInput } from '../../common'

const UserSettings = () => {
    const { id, email, name, defaultWorkplace, userRole } = useUser()
    const { data: ambulances, isLoading: isLoadingAmbulances } = useGetAmbulances()

    const {
        control,
        reset,
        formState: { isDirty },
    } = useForm({
        defaultValues: {
            userRole: 1,
            id: 0,
            email: '',
            name: '',
            defaultWorkplace: '0',
        },
    })

    useEffect(() => {
        if (!isNilOrEmpty(id)) {
            reset({
                userRole,
                id,
                email,
                name,
                defaultWorkplace,
            })
        }
    }, [id, reset])

    return (
        <>
            <Box display="flex" flexDirection="column" alignSelf="center">
                <FormInput label="Jméno" control={control} name="name" fullWidth disabled />
                <FormSelectInput
                    sx={{ marginTop: 0.5 }}
                    label="Role uživatele"
                    name="userRole"
                    control={control}
                    fullWidth
                    disabled={userRole !== 0}
                >
                    {[
                            { label: 'Admin', value: 0 },
                            { label: 'Sestra', value: 1 },
                            { label: 'Doktor', value: 2 },
                        ].map(({ label, value }) => (
                            <MenuItem key={label} value={value} disabled={userRole !== 0}>
                                {label}
                            </MenuItem>
                        ))}
                </FormSelectInput>
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
                    label="Výchozí pracovište"
                    name="defaultWorkplace"
                    control={control}
                    fullWidth
                    disabled
                >
                    {!isLoadingAmbulances &&
                        makeArrayOfLabelValue('name', 'workplace_id', ambulances ?? []).map(
                            ({ label, value }) => (
                                <MenuItem key={label} value={value}>
                                    {label}
                                </MenuItem>
                            ),
                        )}
                </FormSelectInput>
            </Box>
        </>
    )
}

export default UserSettings
