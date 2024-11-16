import { Box, SelectChangeEvent, Typography } from '@mui/material'
import { makeArrayOfLabelValue } from '../../context/Reservation/ReservationHelpers'
import { useGetAmbulances } from '../../hooks/useGetAmbulances'
import Dropdown from './Dropdown'

type AmbulanceSelectProps = {
    showLabel?: boolean
    selectedValueId: number | string
    onAmbulanceSelect: (event: SelectChangeEvent<unknown>, child: React.ReactNode) => void
    defaultValue?: number
}
const AmbulanceSelect = ({
    showLabel = false,
    selectedValueId = '',
    onAmbulanceSelect,
    defaultValue,
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
                defaultValue={defaultValue}
                isLoading={isLoading}
                options={makeArrayOfLabelValue('name', 'workplace_id', ambulances ?? [])}
                value={selectedValueId}
                onChange={onAmbulanceSelect}
            />
        </Box>
    )
}

export default AmbulanceSelect
