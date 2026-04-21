import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material'

type ConfirmDialogProps = {
    open: boolean
    title: string
    description: string
    onConfirm: () => void
    onClose: () => void
    confirmLabel?: string
}

const ConfirmDialog = ({
    open,
    title,
    description,
    onConfirm,
    onClose,
    confirmLabel = 'Smazat',
}: ConfirmDialogProps) => (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Zrušit</Button>
            <Button variant="contained" color="error" onClick={() => { onConfirm(); onClose() }}>
                {confirmLabel}
            </Button>
        </DialogActions>
    </Dialog>
)

export default ConfirmDialog
