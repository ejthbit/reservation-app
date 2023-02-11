import { CircularProgress, InputLabel, MenuItem, Select } from '@mui/material'
import PropTypes from 'prop-types'
import { find, map, propEq } from 'ramda'

const Dropdown = ({
    value,
    options = [],
    onChange,
    className,
    label,
    isLoading = false,
    notSelectedLabel,
    required = false,
    defaultValue = '',
    ...otherSelectProps
}) => {
    const isSelectedValuePartOfOptions = find(propEq('value', value), options)

    const SelectWithoutLabel = () => (
        <Select
            variant="standard"
            value={isSelectedValuePartOfOptions ? value : defaultValue}
            onChange={onChange}
            displayEmpty
            className={className}
            fullWidth
            {...otherSelectProps}
        >
            <MenuItem key="empty" value="" disabled={!notSelectedLabel} selected>
                {notSelectedLabel ? notSelectedLabel : 'Nevybráno'}
            </MenuItem>
            {!isLoading ? (
                map(
                    ({ value, label }) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ),
                    options
                )
            ) : (
                <MenuItem key="loading" value="loading" disabled>
                    <CircularProgress size={20} />
                </MenuItem>
            )}
        </Select>
    )
    return label ? (
        <>
            <InputLabel required={required}>{label}</InputLabel>
            <SelectWithoutLabel />
        </>
    ) : (
        <SelectWithoutLabel />
    )
}

Dropdown.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array,
    onChange: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.string,
    isLoading: PropTypes.bool,
    required: PropTypes.bool,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    notSelectedLabel: PropTypes.string,
}

export default Dropdown
