import { Check, Close, Delete, Edit } from '@mui/icons-material'
import { Box, Fade, IconButton, ListItem, ListItemText, Switch } from '@mui/material'
import { format } from 'date-fns'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { getDateWithCorrectOffset } from '../../../../utils'
import { FormInput } from '../../../common'
import { Announcement } from '../../../../types/Announcement'

interface AdministrationNewsListItemProps {
    id?: string
    created_at?: string
    name: string
    description?: string
    enabled: boolean
    author?: string
    index: number
    onDelete: () => void
    onUpdate: (
        data: AdministrationNewsListItemFormData,
        onSuccess: (payload: Announcement) => void,
    ) => Promise<void>
}

export type AdministrationNewsListItemFormData = Pick<
    AdministrationNewsListItemProps,
    'id' | 'created_at' | 'name' | 'description' | 'author' | 'enabled'
>

const AdministrationNewsListItem: React.FC<AdministrationNewsListItemProps> = ({
    id,
    created_at,
    name,
    description,
    enabled,
    author,
    index,
    onDelete,
    onUpdate,
}) => {
    if (!id || !created_at) return null

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
        setValue,
    } = useForm<AdministrationNewsListItemFormData>({
        defaultValues: { id, created_at, name, description, author },
    })

    const [isEditModeEnabled, setEditModeEnabled] = useState(false)
    const [enabledSwitch, setEnabledSwitch] = useState(enabled)

    const handleUpdate = async (data: AdministrationNewsListItemFormData) => {
        await onUpdate(data, (payload) => {
            setEditModeEnabled(false)
            reset(payload)
        })
    }

    const toggleEditMode = () => {
        setEditModeEnabled((prev) => {
            if (prev) reset()
            return !prev
        })
    }

    const handleSwitchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEnabledState = event.target.checked
        await onUpdate({ author, created_at, description, name, id, enabled: newEnabledState }, () => {
            setEnabledSwitch(newEnabledState)
            setValue('enabled', newEnabledState)
        })
    }

    return (
        <Fade in timeout={{ enter: 200 * index }}>
            <ListItem
                sx={(theme) => ({
                    p: 3,
                    [theme.breakpoints.down('sm')]: { flexDirection: 'column', alignItems: 'center' },
                })}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    width="80%"
                    gap={1}
                    sx={(theme) => ({ [theme.breakpoints.down('sm')]: { width: '100%' } })}
                >
                    <Box display="flex" gap={2}>
                        <FormInput
                            name="name"
                            label="Název"
                            control={control}
                            disabled={!isEditModeEnabled}
                            sx={{
                                flex: 1,
                                ...(!isEditModeEnabled
                                    ? { '& .MuiInput-root:before': { borderBottom: 0 } }
                                    : {}),
                            }}
                        />
                        <ListItemText
                            primary="Autor"
                            secondary={author}
                            primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                            sx={{
                                flex: 1,
                                ...(!isEditModeEnabled
                                    ? { '& .MuiInput-root:before': { borderBottom: 0 } }
                                    : {}),
                            }}
                        />
                        <ListItemText
                            sx={{ flex: 0.6, alignSelf: 'flex-end' }}
                            primary="Datum vytvoření"
                            primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                            secondary={format(getDateWithCorrectOffset(created_at), 'dd-MM-yyyy')}
                        />
                    </Box>
                    <FormInput
                        name="description"
                        control={control}
                        label="Popis"
                        multiline
                        disabled={!isEditModeEnabled}
                        sx={!isEditModeEnabled ? { '& .MuiInput-root:before': { borderBottom: 0 } } : {}}
                    />
                </Box>
                <Box
                    sx={(theme) => ({
                        width: '8%',
                        display: 'flex',
                        ml: 1,
                        mr: 2,
                        [theme.breakpoints.down('sm')]: {
                            width: '100%',
                            ml: 0,
                            mr: 0,
                            justifyContent: 'center',
                        },
                    })}
                >
                    <IconButton onClick={toggleEditMode}>
                        {isEditModeEnabled ? <Close /> : <Edit />}
                    </IconButton>
                    {isEditModeEnabled ? (
                        <IconButton onClick={handleSubmit(handleUpdate)} disabled={!isDirty}>
                            <Check />
                        </IconButton>
                    ) : (
                        <IconButton onClick={onDelete}>
                            <Delete />
                        </IconButton>
                    )}
                </Box>
                <Switch
                    edge="end"
                    onChange={handleSwitchChange}
                    checked={enabledSwitch}
                    inputProps={{ 'aria-labelledby': 'Zapnout aktualitu' }}
                />
            </ListItem>
        </Fade>
    )
}

export default AdministrationNewsListItem
