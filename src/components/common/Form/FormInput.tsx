import { SxProps, TextField, TextFieldProps, TextFieldVariants, Theme } from '@mui/material'
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form'

type FormInputProps<V extends FieldValues = FieldValues, N extends FieldPath<V> = FieldPath<V>> = {
    variant?: TextFieldVariants
    children?: React.ReactNode
    disabled?: boolean
    className?: SxProps<Theme>
    isLoading?: boolean
    displayEmpty?: boolean
} & UseControllerProps<V, N>

const disabledStyling = {
    opacity: 0.5,
    pointerEvents: 'none',
    color: 'rgba(0, 0, 0, 0.38)',
    cursor: 'default',
}

const FormInput = <T extends FieldValues, V extends FieldPath<T>>({
    variant = 'standard',
    control,
    name,
    disabled,
    className,
    defaultValue,
    ...otherTextFieldProps
}: FormInputProps<T, V> & Partial<TextFieldProps>) => {
    const {
        field: { ref, ...inputProps },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue: undefined,
    })
    return (
        <TextField
            variant={variant}
            sx={disabled ? { ...disabledStyling } : { ...otherTextFieldProps.sx }}
            error={!!error}
            helperText={error?.message}
            inputProps={{ readOnly: disabled, ...inputProps }}
            inputRef={ref}
            {...otherTextFieldProps}
        />
    )
}

export default FormInput
