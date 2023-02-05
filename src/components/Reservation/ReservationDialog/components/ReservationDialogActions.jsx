import { Button, DialogActions, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const ReservationDialogActions = ({ onClose }) => {
    return (
        <DialogActions
            sx={(theme) => ({
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: '52px',
                paddingLeft: '52px',
                '& .MuiTypography-body2': {
                    '& span': {
                        color: 'red !important',
                    },
                },
                '& .MuiButtonBase-root': {
                    width: '30%',
                },
                [theme.breakpoints.down('md')]: {
                    paddingRight: theme.spacing(2),
                    paddingLeft: theme.spacing(2),
                },
            })}
        >
            <Typography variant="body2">
                Povinná pole jsou označena <span> *</span>
            </Typography>
            <Button variant="outlined" onClick={onClose} color="primary">
                Zavřít
            </Button>
        </DialogActions>
    )
}

ReservationDialogActions.propTypes = {
    onClose: PropTypes.func.isRequired,
}

export default ReservationDialogActions
