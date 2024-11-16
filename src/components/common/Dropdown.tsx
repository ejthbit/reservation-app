import { CircularProgress, InputLabel, MenuItem, Select, type SelectProps } from '@mui/material'
import { map } from 'ramda'

export type DropdownProps = {
    value?: string | number
    options?: {
        label: string | React.ReactNode
        value: string | number
    }[]
    className?: string
    label?: string
    isLoading?: boolean
    required?: boolean
    defaultValue?: string | number
    notSelectedLabel?: string
} & SelectProps

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
}: DropdownProps) => {
    const isSelectedValuePartOfOptions = options.find(({ value }) => value)

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
                    options,
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

export default Dropdown
