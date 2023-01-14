import { useEffect, useState } from 'react'
import { Backdrop, Box, Fade, Typography } from '@mui/material'
import { CheckCircleOutlineOutlined } from '@mui/icons-material'
// import { useSelector } from 'react-redux'

const ReservationBackdropMessage = () => {
    const isOrderCompleted = /* useSelector(getOrderFinishedOk) ??  */ false
    const [isSuccessMsgVisible, setIsSuccessMsgVisible] = useState(false)
    const toggleSuccessMsgBackdrop = () =>
        setIsSuccessMsgVisible((prevState) => !prevState)

    useEffect(() => {
        if (isOrderCompleted)
            setTimeout(() => {
                toggleSuccessMsgBackdrop()
            }, 200)
        setTimeout(() => {
            toggleSuccessMsgBackdrop()
        }, 2500)
    }, [isOrderCompleted])

    return (
        <Backdrop
            sx={(theme) => ({
                zIndex: theme.zIndex.tooltip + 1,
            })}
            open={isSuccessMsgVisible}
            transitionDuration={1000}
        >
            <Fade in timeout={500}>
                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        justifyItems: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        '& svg': {
                            width: theme.spacing(15),
                            height: theme.spacing(15),
                        },
                    })}
                >
                    <CheckCircleOutlineOutlined color="primary" />
                    <Typography variant="h5" color="primary">
                        Vaše objednávka byla uspěšně vytvořena!
                    </Typography>
                </Box>
            </Fade>
        </Backdrop>
    )
}

export default ReservationBackdropMessage
