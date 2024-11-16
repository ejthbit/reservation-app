import { Button } from '@mui/material'

type DialogButtonsProps = {
    onPrimaryClick?: () => void
    onSecondaryClick?: () => void
    primaryLabel?: string
    secondaryLabel?: string
    disabledPrimary?: boolean
    additionalActionComponent?: React.ReactNode
}
const DialogButtons = ({
    onPrimaryClick,
    onSecondaryClick,
    primaryLabel,
    secondaryLabel,
    disabledPrimary = false,
    additionalActionComponent,
}: DialogButtonsProps) => {
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

export default DialogButtons
