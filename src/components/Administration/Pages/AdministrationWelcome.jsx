import { Box, Fade, List, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { getUserInfo } from '../../../store/userInfo'
import AdministrationDashboardTodayPatients from './components/AdministrationDashboardTodayPatients'
import imgLogo from '../../../assets/stetoscope.svg'

const AdministrationWelcome = () => {
    const { name } = useSelector(getUserInfo)

    return (
        <Fade in timeout={{ enter: 600 }}>
            <Box
                sx={{
                    width: '100%',
                }}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={8}
                    mb={5}
                    height={'20vh'}
                    sx={(theme) => ({ bgcolor: '#F9F9FB', borderRadius: 2 })}
                >
                    <Box display="flex" gap={0.5} flexDirection="column">
                        <Typography
                            variant="h3"
                            sx={(theme) => ({
                                color: theme.palette.primary.main,
                                display: 'flex',
                                flexDirection: 'column',
                            })}
                        >
                            <span>
                                <span style={{ fontWeight: 600 }}>Vítejte</span> {`${name}!`}
                            </span>
                        </Typography>
                        <Typography>
                            Na dnešní den je objednáno 8 pacientů!
                            <br />
                            Před vývoláním zkontrolujte kartu pacienta.
                        </Typography>
                    </Box>
                    <img src={imgLogo} alt="Welcome logo" height={175} />
                </Box>
                <Box display="flex" gap={'3vw'} mb={3}>
                    <AdministrationDashboardTodayPatients />
                    <Box
                        width={{
                            md: '66.6vw',
                            sm: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3vw',
                        }}
                    >
                        <List
                            sx={(theme) => ({
                                width: '100%',
                                bgcolor: '#F9F9FB',
                                borderRadius: 2,
                                height: '30vh',
                            })}
                        >
                            <Typography sx={{ mb: 1, ml: 3, mt: 1 }} variant="h6" fontWeight="600">
                                Počet pacientu dle kategorie za posledních 30 dnů
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="center" height="80%">
                                <Typography>Omlouváme se ale nemáte dostatek dat pro zobrazení.</Typography>
                            </Box>
                        </List>
                        <List
                            sx={(theme) => ({
                                width: '100%',
                                bgcolor: '#F9F9FB',
                                borderRadius: 2,
                                height: '30vh',
                            })}
                        >
                            <Typography sx={{ mb: 1, ml: 3, mt: 1 }} variant="h6" fontWeight="600">
                                Průměrný počet pacientu dle dnů za posledních 30 dnů
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="center" height="80%">
                                <Typography>Omlouváme se ale nemáte dostatek dat pro zobrazení.</Typography>
                            </Box>
                        </List>
                    </Box>
                </Box>
            </Box>
        </Fade>
    )
}

export default AdministrationWelcome
