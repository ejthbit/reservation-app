import { CircularProgress, MenuItem, TextField, TextFieldProps } from '@mui/material'
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form'

type FormSelectInputProps<V extends FieldValues = FieldValues, N extends FieldPath<V> = FieldPath<V>> = {
    children?: React.ReactNode
    disabled?: boolean
    isLoading?: boolean
    displayEmpty?: boolean
} & UseControllerProps<V, N>

const disabledStyling = {
    opacity: 0.5,
    pointerEvents: 'none',
    color: 'rgba(0, 0, 0, 0.38)',
    cursor: 'default',
}

const FormSelectInput = <T extends FieldValues, V extends FieldPath<T>>({
    control,
    name,
    children,
    disabled,
    className,
    displayEmpty,
    isLoading = false,
    ...otherTextFieldProps
}: FormSelectInputProps<T, V> & Partial<TextFieldProps>) => {
    const {
        field: { ref, ...inputProps },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue: undefined,
    })

    const selectValue = isLoading ? '' : inputProps.value

    return (
        <TextField
            select
            variant="standard"
            sx={disabled ? { ...disabledStyling } : { ...otherTextFieldProps.sx }}
            error={!!error}
            helperText={error?.message}
            inputRef={ref}
            SelectProps={{
                MenuProps: {
                    disableScrollLock: true,
                },
                displayEmpty,
            }}
            inputProps={{ readOnly: disabled, ...inputProps, value: selectValue }}
            {...otherTextFieldProps}
        >
            {isLoading && (
                <MenuItem key="loading" value="loading" disabled>
                    <CircularProgress size={20} />
                </MenuItem>
            )}
            {children}
        </TextField>
    )
}

export default FormSelectInput
