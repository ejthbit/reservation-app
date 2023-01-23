import { MenuItem, Select } from '@mui/material'
import PropTypes from 'prop-types'
import { map, propEq, find } from 'ramda'

const Dropdown = ({
    value,
    options = [],
    onChange,
    className,
    label,
    notSelectedLabel,
    ...otherSelectProps
}) => {
    const isSelectedValuePartOfOptions = find(propEq('value', value), options)

    return (
        <Select
            variant="standard"
            value={isSelectedValuePartOfOptions ? value : ''}
            onChange={onChange}
            displayEmpty
            className={className}
            label={label}
            fullWidth
            {...otherSelectProps}
        >
            <MenuItem key="" value="" disabled={!notSelectedLabel} selected>
                {notSelectedLabel ? notSelectedLabel : 'Nevybráno'}
            </MenuItem>
            {map(
                ({ value, label }) => (
                    <MenuItem key={value} value={value}>
                        {label}
                    </MenuItem>
                ),
                options
            )}
        </Select>
    )
}

Dropdown.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array,
    onChange: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.string,
    notSelectedLabel: PropTypes.string,
}

export default Dropdown
