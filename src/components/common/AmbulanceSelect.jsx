import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useGetAmbulances } from '../../hooks/useGetAmbulances'
import Dropdown from './Dropdown'
import { makeArrayOfLabelValue } from '../../store/reservationProcess'

const AmbulanceSelect = ({ showLabel, selectedValueId = '', onAmbulanceSelect, defaultValue }) => {
    const { data: ambulances, isloading } = useGetAmbulances()
    return (
        <Box>
            {showLabel && (
                <Box marginRight={2}>
                    <Typography>Vybrané pracoviště</Typography>
                </Box>
            )}
            <Dropdown
                defaultValue={defaultValue}
                isLoading={isloading}
                options={makeArrayOfLabelValue('name', 'workplace_id', ambulances ?? [])}
                value={selectedValueId}
                onChange={onAmbulanceSelect}
            />
        </Box>
    )
}

AmbulanceSelect.propTypes = {
    showLabel: PropTypes.bool,
    selectedValueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onAmbulanceSelect: PropTypes.func.isRequired,
    defaultValue: PropTypes.oneOfType([PropTypes.number]),
}

export default AmbulanceSelect
