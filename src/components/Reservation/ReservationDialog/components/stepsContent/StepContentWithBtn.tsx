import { Done, Error } from '@mui/icons-material'
import { Button, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
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
            {typeof text === 'string' ? (
                <Typography color={variant}>
                    {text}
                    {variant === 'primary' ? <Done /> : <Error />}
                </Typography>
            ) : (
                text
            )}
            {onSecondaryBtnClick && secondaryBtnText && (
                <StyledButton variant="outlined" onClick={onSecondaryBtnClick}>
                    {secondaryBtnText}
                </StyledButton>
            )}
            <StyledButton variant="outlined" color="primary" onClick={onBtnClick}>
                {btnText}
            </StyledButton>
        </Paper>
    )
}

export default StepContentWithBtn
