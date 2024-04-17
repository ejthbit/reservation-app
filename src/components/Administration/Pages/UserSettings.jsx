import { Box, MenuItem, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { getUserInfo } from '../../../store/userInfo'
import { useForm } from 'react-hook-form'
import { FormInput, FormSelectInput } from '../../common'
import { makeArrayOfLabelValue } from '../../../store/reservationProcess'
import { map } from 'ramda'
import { useGetAmbulances } from '../../../hooks/useGetAmbulances'
import { useEffect } from 'react'
import { isNilOrEmpty } from '../../../utils'

const UserSettings = () => {
    const { userRole, id, email, name, default_workplace } = useSelector(getUserInfo)
    const { data: ambulances, isLoading: isLoadingAmbulances } = useGetAmbulances()

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
        setValue,
    } = useForm({
        defaultValues: {
            userRole: '',
            id: '',
            email: '',
            name: '',
            default_workplace: 0,
        },
    })

    useEffect(() => {
        if (!isNilOrEmpty(id)) {
            reset({
                userRole,
                id,
                email,
                name,
                default_workplace,
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
                    {map(
                        ({ label, value }) => (
                            <MenuItem key={label} value={value} disabled={userRole !== 0}>
                                {label}
                            </MenuItem>
                        ),
                        [
                            { label: 'Admin', value: 0 },
                            { label: 'Sestra', value: 1 },
                            { label: 'Doktor', value: 2 },
                        ]
                    )}
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
                    name="default_workplace"
                    control={control}
                    fullWidth
                    disabled
                >
                    {!isLoadingAmbulances &&
                        map(
                            ({ label, value }) => (
                                <MenuItem key={label} value={value}>
                                    {label}
                                </MenuItem>
                            ),
                            makeArrayOfLabelValue('name', 'workplace_id', ambulances ?? [])
                        )}
                </FormSelectInput>
            </Box>
        </>
    )
}

export default UserSettings
