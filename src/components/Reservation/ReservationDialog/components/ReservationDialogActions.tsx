import { DialogActions, Typography } from '@mui/material'

const ReservationDialogActions = ({ onClose }: { onClose: () => void }) => {
    return (
        <DialogActions
            sx={(theme) => ({
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: '52px',
                paddingLeft: '30px',
                marginBottom: theme.spacing(2),
                '& .MuiTypography-caption': {
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
            <Typography variant="caption">
                Povinná pole jsou označena <span> *</span>
            </Typography>
        </DialogActions>
    )
}

export default ReservationDialogActions
