import { Check, Close, Delete, Edit } from '@mui/icons-material'
import { Box, Fade, IconButton, ListItem, ListItemText, Switch } from '@mui/material'
import { format } from 'date-fns'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { getDateWithCorrectOffset, isSuccess } from '../../../../utils'
import { FormInput } from '../../../common'

const AdministrationNewsListItem = ({
    id,
    created_at,
    name,
    description,
    enabled,
    onDelete,
    onUpdate,
    author,
    index,
}) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
        setValue,
    } = useForm({
        defaultValues: {
            id,
            created_at,
            name,
            description,
            author,
        },
    })
    const [isEditModeEnabled, setEditModeEnabled] = useState(false)
    const [enabledSwitch, setEnabledSwitch] = useState(enabled)

    const handleUpdate = async (data) => {
        await onUpdate(data).then((payload) => {
            if (isSuccess(payload)) {
                setEditModeEnabled((prevState) => !prevState)
                reset(payload)
            }
        })
    }

    return (
        <Fade in timeout={{ enter: 200 * index }}>
            <ListItem
                sx={(theme) => ({
                    p: 3,
                    [theme.breakpoints.down('sm')]: {
                        flexDirection: 'column',
                        alignItems: 'center',
                    },
                })}
            >
                <ListItemText
                    sx={(theme) => ({
                        width: '22%',
                        '& .MuiTypography-root': {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        },
                        [theme.breakpoints.down('sm')]: {
                            width: '100%',
                        },
                    })}
                    id="switch-list-item"
                    primary={author}
                    secondary={format(getDateWithCorrectOffset(created_at), 'yyyy-dd-MM')}
                />
                <Box
                    display="flex"
                    flexDirection="column"
                    width={'60%'}
                    gap={1}
                    sx={(theme) => ({
                        [theme.breakpoints.down('sm')]: {
                            width: '100%',
                        },
                    })}
                >
                    <FormInput
                        sx={
                            !isEditModeEnabled && {
                                '& .MuiInput-root:before': {
                                    borderBottom: 0,
                                },
                            }
                        }
                        label="Název"
                        control={control}
                        name="name"
                        disabled={!isEditModeEnabled}
                    />
                    <FormInput
                        sx={
                            !isEditModeEnabled && {
                                '& .MuiInput-root:before': {
                                    borderBottom: 0,
                                },
                            }
                        }
                        label="Popis"
                        control={control}
                        name="description"
                        multiline
                        disabled={!isEditModeEnabled}
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
                    <IconButton
                        onClick={() => {
                            setEditModeEnabled((prevState) => {
                                prevState && reset()
                                return !prevState
                            })
                        }}
                    >
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
                    onChange={async (e) => {
                        const res = await onUpdate({ enabled: e.target.checked, id })
                        if (isSuccess(res)) {
                            setEnabledSwitch((prevState) => !prevState)
                            setValue('enabled', e.target.checked)
                        }
                    }}
                    checked={enabledSwitch}
                    inputProps={{
                        'aria-labelledby': 'Zapnout aktualitu',
                    }}
                />
            </ListItem>
        </Fade>
    )
}

AdministrationNewsListItem.propTypes = {
    id: PropTypes.number,
    created_at: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
    author: PropTypes.string,
    index: PropTypes.number,
}

export default AdministrationNewsListItem
