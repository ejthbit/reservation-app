import { Button, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    background: `linear-gradient(to right, #6A11CB, #2575FC)`,
}))

type StepContentWithBtnProps = {
    text: string | React.ReactNode
    variant: 'primary' | 'error'
    onBtnClick: () => void
    btnText: string
    onSecondaryBtnClick?: () => void
    secondaryBtnText?: string
}
const StepContentWithBtn = ({
    text,
    variant,
    onBtnClick,
    btnText,
    onSecondaryBtnClick,
    secondaryBtnText,
}: StepContentWithBtnProps) => {
    return (
        <Paper square elevation={0}>
            {typeof text === 'string' ? <Typography color={variant}>{text}</Typography> : text}
            {onSecondaryBtnClick && secondaryBtnText && (
                <StyledButton variant="outlined" onClick={onSecondaryBtnClick}>
                    {secondaryBtnText}
                </StyledButton>
            )}
            <StyledButton variant="contained" color="primary" onClick={onBtnClick}>
                {btnText}
            </StyledButton>
        </Paper>
    )
}

export default StepContentWithBtn
