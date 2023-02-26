import { TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useController } from 'react-hook-form'

const disabledStyling = {
    opacity: 0.5,
    pointerEvents: 'none',
    color: 'rgba(0, 0, 0, 0.38)',
    cursor: 'default',
}

const FormInput = ({ variant = 'standard', control, name, disabled, className, ...otherTextFieldProps }) => {
    const {
        field: { ref, ...inputProps },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue: '',
    })
    return (
        <TextField
            variant={variant}
            sx={disabled ? { ...disabledStyling, ...className } : { ...className }}
            error={!!error}
            helperText={error?.message}
            readOnly={disabled}
            inputRef={ref}
            {...inputProps}
            {...otherTextFieldProps}
        />
    )
}

FormInput.propTypes = {
    variant: PropTypes.string,
    control: PropTypes.object,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.object,
}

export default FormInput
