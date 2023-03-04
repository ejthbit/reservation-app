import { CircularProgress, MenuItem, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useController } from 'react-hook-form'

const disabledStyling = {
    opacity: 0.5,
    pointerEvents: 'none',
    color: 'rgba(0, 0, 0, 0.38)',
    cursor: 'default',
}
const FormSelectInput = ({
    control,
    name,
    children,
    disabled,
    className,
    displayEmpty,
    isLoading = false,
    ...otherTextFieldProps
}) => {
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
            select
            variant="standard"
            sx={disabled ? { ...disabledStyling, ...className } : { ...className }}
            error={!!error}
            helperText={error?.message}
            readOnly={disabled}
            inputRef={ref}
            SelectProps={{
                MenuProps: {
                    disableScrollLock: true,
                },
                displayEmpty,
            }}
            {...inputProps}
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

FormSelectInput.propTypes = {
    control: PropTypes.object,
    select: PropTypes.object,
    children: PropTypes.node,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.object,
    isLoading: PropTypes.bool,
    displayEmpty: PropTypes.bool,
}

export default FormSelectInput
