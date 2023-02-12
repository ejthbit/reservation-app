import PropTypes from 'prop-types'
import { Button } from '@mui/material'

const DialogButtons = ({
    onPrimaryClick,
    onSecondaryClick,
    primaryLabel,
    secondaryLabel,
    disabledPrimary = false,
    additionalActionComponent,
}) => {
    return (
        <>
            <Button onClick={onSecondaryClick} variant="outlined" color="primary">
                {secondaryLabel}
            </Button>
            {additionalActionComponent && additionalActionComponent}
            <Button variant="contained" color="primary" onClick={onPrimaryClick} disabled={disabledPrimary}>
                {primaryLabel}
            </Button>
        </>
    )
}

DialogButtons.propTypes = {
    onPrimaryClick: PropTypes.func,
    onSecondaryClick: PropTypes.func,
    primaryLabel: PropTypes.string,
    secondaryLabel: PropTypes.string,
    disabledPrimary: PropTypes.bool,
    additionalActionComponent: PropTypes.node,
}

export default DialogButtons
