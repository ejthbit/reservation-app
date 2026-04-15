import { Box, SelectChangeEvent, SelectVariants, type SxProps, type Theme, Typography } from '@mui/material'
import { makeArrayOfLabelValue } from '../../context/Reservation/ReservationHelpers'
import { useGetAmbulances } from '../../hooks/useGetAmbulances'
import Dropdown from './Dropdown'

type AmbulanceSelectProps = {
    variant?: SelectVariants
    showLabel?: boolean
    selectedValueId: number | string
    onAmbulanceSelect: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void
    defaultValue?: number
    sx?: SxProps<Theme>
}
const AmbulanceSelect = ({
    showLabel = false,
    variant = 'standard',
    selectedValueId = '',
    onAmbulanceSelect,
    defaultValue,
    sx,
}: AmbulanceSelectProps) => {
    const { data: ambulances, isLoading } = useGetAmbulances()
    return (
        <Box>
            {showLabel && (
                <Box marginRight={2}>
                    <Typography>Vybrané pracoviště</Typography>
                </Box>
            )}
            <Dropdown
                variant={variant}
                defaultValue={defaultValue}
                isLoading={isLoading}
                options={makeArrayOfLabelValue('name', 'workplace_id', ambulances ?? [])}
                value={selectedValueId}
                onChange={onAmbulanceSelect}
                sx={sx}
            />
        </Box>
    )
}

export default AmbulanceSelect
