import { AddBox, ArrowBack, Edit } from '@mui/icons-material'
import { Box, Button, CircularProgress, Fade, Grid, TextField, Typography, useTheme } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers'
import { format, getMonth, getYear } from 'date-fns'
import { useSnackbar } from 'notistack'
import { equals, includes, map } from 'ramda'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserConfigurationSelectedAmbulance } from '../../../store/administration'
import { useLazyGetDoctorServicesForMonthQuery } from '../../../store/reservationProcess'
import { isNilOrEmpty } from '../../../utils'
import { getWorkDaysInMonth } from '../../../utils/getDaysUtil'
import { AdministrationServiceCardButton, AdministrationServicesTable } from './components'

const actionLabel = {
    1: 'Vytvořit nový měsíční plán',
    2: 'Upravit měsíční plán',
}
const AdministrationServices = () => {
    const theme = useTheme()
    const selectedAmbulanceId = useSelector(getUserConfigurationSelectedAmbulance)
    const [fetchDoctorServicesForSelectedMonth, { isFetching }] = useLazyGetDoctorServicesForMonthQuery()

    const d = new Date()
    const [selectedAction, setSelectedAction] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState(new Date(d.setMonth(d.getMonth() + 1)))
    const [dates, setDates] = useState([])
    const { enqueueSnackbar } = useSnackbar()
    const handleSetActionWorkflow = (value) => setSelectedAction(value)

    const handleClearActionsWorkflow = () => {
        setDates([])
        handleSetActionWorkflow(0)
    }

    const handleGenerateDataForTable = async (date) => {
        setSelectedMonth(date)
        try {
            const payload = await fetchDoctorServicesForSelectedMonth({
                month: format(date, 'yyyy-MM'),
                workplace: selectedAmbulanceId,
            }).unwrap()
            if (equals(selectedAction, 2) && payload.days) {
                setDates(payload.days)
            } else if (equals(selectedAction, 1) && payload.days) {
                setDates([])
                enqueueSnackbar('Na daný měsíc již existuje rozpis.', { variant: 'warning' })
            }
        } catch (error) {
            if (error.code === 'ERR_BAD_REQUEST') {
                enqueueSnackbar('Pro zadaný měsíc zatím neexistuje rozpis služeb', { variant: 'warning' })
                if (equals(selectedAction, 1)) {
                    const workingDates = getWorkDaysInMonth(getMonth(date), getYear(date))
                    setDates(
                        map(
                            (date) => ({
                                date,
                                doctors: [
                                    {
                                        doctorId: '',
                                        start: '',
                                        end: '',
                                        note: '',
                                    },
                                ],
                            }),
                            workingDates
                        )
                    )
                }
            } else enqueueSnackbar('Při načítační nastala chyba', { variant: 'error' })
        }
    }

    useEffect(() => {
        if (!equals(selectedAction, 0)) handleGenerateDataForTable(selectedMonth)
    }, [selectedAmbulanceId, selectedAction])

    return (
        <Fade in timeout={{ enter: 500 }}>
            <Box
                sx={{
                    width: '100%',
                }}
            >
                {includes(selectedAction, [1, 2]) ? (
                    <Grid container>
                        <Grid container sx={{ marginBottom: 2 }}>
                            <Grid item>
                                <Typography variant="subtitle1">{actionLabel[selectedAction]}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container gap={2}>
                            <Grid item>
                                <Button
                                    sx={{ height: 48, textTransform: 'initial' }}
                                    variant="contained"
                                    color="primary"
                                    onClick={handleClearActionsWorkflow}
                                    startIcon={<ArrowBack />}
                                >
                                    Vrátit se zpět
                                </Button>
                            </Grid>
                            <Grid item>
                                <MobileDatePicker
                                    label="Výběr měsíce: "
                                    orientation="landscape"
                                    inputFormat="MMMM, yyyy"
                                    mask="____, ____"
                                    margin="none"
                                    value={selectedMonth}
                                    onChange={(date) => handleGenerateDataForTable(date)}
                                    views={['month', 'year']}
                                    openTo="month"
                                    renderInput={(props) => <TextField {...props} variant="standard" />}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                ) : (
                    <Box
                        sx={(theme) => ({
                            display: 'flex',
                            gap: 2,
                            flexDirection: 'row',
                            [theme.breakpoints.down('sm')]: {
                                flexDirection: 'column',
                            },
                        })}
                    >
                        <Grid item>
                            <AdministrationServiceCardButton
                                color={theme.palette.primary.main}
                                icon={AddBox}
                                title={'Vytvořit nový měsíční plán'}
                                description={
                                    'Zjednodušuje proces vytváření a správy měsíčního plánu pro vybranou ambulanci. Zjednodušuje úkol přiřazení lékařů ke každému dni a umožňuje snadnou úpravu plánu podle potřeby. Tato funkce šetří čas a zvyšuje efektivitu procesu plánování, což zajišťuje, že poskytované služby fungují hladce a efektivně.'
                                }
                                onClick={() => handleSetActionWorkflow(1)}
                            />
                        </Grid>
                        <Grid item>
                            <AdministrationServiceCardButton
                                color={theme.palette.primary.main}
                                icon={Edit}
                                title={'Upravit měsíční plán'}
                                description={
                                    'Zjednodušuje proces úprav měsíčního plánu pro vybranou ambulanci. Zjednodušuje úkol úpravy pracovního plánu lékařů a umožňuje snadné upravování plánu podle potřeby. Tato funkce šetří čas a zvyšuje efektivitu procesu plánování, což zajišťuje, že poskytované služby fungují hladce a efektivně.'
                                }
                                onClick={() => handleSetActionWorkflow(2)}
                            />
                        </Grid>
                    </Box>
                )}
                {!isNilOrEmpty(dates) ? (
                    <Grid item xs={12}>
                        <AdministrationServicesTable
                            data={dates}
                            selectedMonth={format(selectedMonth, 'yyyy-MM')}
                            isEditingServices={equals(selectedAction, 2)}
                            selectedWorkplaceId={selectedAmbulanceId}
                        />
                    </Grid>
                ) : (
                    includes(selectedAction, [1, 2]) && (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            width="100%"
                            height="100%"
                        >
                            <Typography>{`Prosím vyberte měsíc, pro který ${
                                selectedAction == 1 ? 'neexistuje' : 'existuje'
                            } měsíční plán`}</Typography>
                        </Box>
                    )
                )}
                {isFetching && (
                    <Fade in timeout={{ enter: 1000 }}>
                        <CircularProgress
                            size={100}
                            sx={{ zIndex: '1200', position: 'fixed', top: '50vh', left: '50vw' }}
                        />
                    </Fade>
                )}
            </Box>
        </Fade>
    )
}

export default AdministrationServices
