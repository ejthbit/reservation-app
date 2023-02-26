import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useLazyGetAmbulancesQuery } from '../../store/reservationProcess'
import { isNilOrEmpty } from '../../utils'
import Dropdown from './Dropdown'

const AmbulanceSelect = ({ showLabel, selectedValueId = '', onAmbulanceSelect, defaultValue }) => {
    const [getAmbulances, { data: ambulances, isFetching }] = useLazyGetAmbulancesQuery()

    useEffect(() => {
        if (isNilOrEmpty(ambulances)) getAmbulances()
    }, [ambulances])

    return (
        <Box>
            {showLabel && (
                <Box marginRight={2}>
                    <Typography>Vybrané pracoviště</Typography>
                </Box>
            )}
            <Dropdown
                defaultValue={defaultValue}
                isLoading={isFetching}
                options={ambulances}
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
