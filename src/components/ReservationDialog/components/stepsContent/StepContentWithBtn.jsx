import { Done, Error } from '@mui/icons-material'
import { Button, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { equals } from 'ramda'

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
}))

const StepContentWithBtn = ({
    text,
    variant,
    onBtnClick,
    btnText,
    onSecondaryBtnClick,
    secondaryBtnText,
}) => {
    return (
        <Paper square elevation={0}>
            {equals(typeof text, 'string') ? (
                <Typography color={variant} end>
                    {text}
                    {equals(variant, 'primary') ? <Done /> : <Error />}
                </Typography>
            ) : (
                text
            )}
            {onSecondaryBtnClick && secondaryBtnText && (
                <StyledButton variant="outlined" onClick={onSecondaryBtnClick}>
                    {secondaryBtnText}
                </StyledButton>
            )}
            <StyledButton
                variant="outlined"
                color="primary"
                onClick={onBtnClick}
            >
                {btnText}
            </StyledButton>
        </Paper>
    )
}

StepContentWithBtn.propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    variant: PropTypes.oneOf(['primary', 'error']),
    onBtnClick: PropTypes.func,
    btnText: PropTypes.string,
    onSecondaryBtnClick: PropTypes.func,
    secondaryBtnText: PropTypes.string,
}

export default StepContentWithBtn
