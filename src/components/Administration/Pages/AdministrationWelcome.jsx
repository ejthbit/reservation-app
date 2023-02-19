import { Fade, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { getUserInfo } from '../../../store/userInfo'

const AdministrationWelcome = () => {
    const { name } = useSelector(getUserInfo)

    return (
        <Fade in timeout={{ enter: 600 }}>
            <Typography
                variant="h4"
                align="center"
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}
            >
                <span>Vítejte</span>
                {name}
            </Typography>
        </Fade>
    )
}

export default AdministrationWelcome
