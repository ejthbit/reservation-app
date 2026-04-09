import { AddBox, ArrowBack, Edit } from '@mui/icons-material'
import { Box, Button, CircularProgress, Fade, Grid, TextField, Typography, useTheme } from '@mui/material'
import { MobileDatePicker } from '@mui/x-date-pickers'
import { format, getMonth, getYear } from 'date-fns'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { isNilOrEmpty } from '../../../utils'
import { getWorkDaysInMonth } from '../../../utils/getDaysUtil'
import { AdministrationServiceCardButton, AdministrationServicesTable } from './components'
import { useAdministration } from '../../../context/Administration/AdministrationProvider'
import { useDoctorServices } from '../../../hooks'
import { AmbulanceServiceDay } from '../../../types/AmbulanceService'

const actionLabel = ['Prosím vyberte hodnotu', 'Vytvořit nový měsíční plán', 'Upravit měsíční plán']

const AdministrationServices = () => {
    const theme = useTheme()
    const { selectedWorkspace: selectedAmbulanceId } = useAdministration()
    const {
        api: { fetchDoctorServicesForSelectedMonth },
        isLoadingDoctorsServicesForSelectedAmbulance,
    } = useDoctorServices()

    const d = new Date()
    const [selectedAction, setSelectedAction] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState(new Date(d.setMonth(d.getMonth() + 1)))
    const [dates, setDates] = useState<AmbulanceServiceDay[]>([])
    const { enqueueSnackbar } = useSnackbar()
    const handleSetActionWorkflow = (value: number) => setSelectedAction(value)

    const handleClearActionsWorkflow = () => {
        setDates([])
        handleSetActionWorkflow(0)
    }

    const handleGenerateDataForTable = async (date: Date) => {
        setSelectedMonth(date)
        try {
            const payload = await fetchDoctorServicesForSelectedMonth({
                month: format(date, 'yyyy-MM'),
                workplace: parseInt(selectedAmbulanceId),
            })
            if (selectedAction === 2 && payload.days) {
                setDates(payload.days)
            } else if (selectedAction === 1 && payload.days) {
                setDates([])
                enqueueSnackbar('Na daný měsíc již existuje rozpis.', { variant: 'warning' })
            }
        } catch (error) {
            const err = error as { code?: string }
            if (err.code === 'ERR_BAD_REQUEST') {
                enqueueSnackbar('Pro zadaný měsíc zatím neexistuje rozpis služeb', { variant: 'warning' })
                if (selectedAction === 1) {
                    const workingDates = getWorkDaysInMonth(getMonth(date), getYear(date))
                    setDates(
                        workingDates.map((date, index) => ({
                            date,
                            doctors: [
                                {
                                    doctorId: '',
                                    start: '',
                                    end: '',
                                    note: '',
                                    id: index.toString(),
                                },
                            ],
                        })),
                    )
                }
            } else enqueueSnackbar('Při načítační nastala chyba', { variant: 'error' })
        }
    }

    useEffect(() => {
        setDates([])
        if (selectedAction !== 0) handleGenerateDataForTable(selectedMonth)
    }, [selectedAmbulanceId, selectedAction])

    return (
        <Fade in timeout={{ enter: 500 }}>
            <Box
                sx={{
                    width: '100%',
                }}
            >
                {[1, 2].includes(selectedAction) ? (
                    <Grid container>
                        <Grid container sx={{ marginBottom: 2 }}>
                            <Grid item>
                                <Typography variant="subtitle1">{actionLabel[selectedAction]}</Typography>
                            </Grid>
                        </Grid>
                        <Grid container gap={2}>
                            <Grid item>
                                <Button
                                    sx={{
                                        height: 56,
                                        textTransform: 'initial',
                                        background: `linear-gradient(to right, #6A11CB, #2575FC)`,
                                    }}
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
                                    format="MMMM, yyyy"
                                    // margin="none"
                                    value={selectedMonth}
                                    onChange={(date) => date && handleGenerateDataForTable(date)}
                                    views={['month', 'year']}
                                    openTo="month"
                                    slots={{
                                        textField: (props) => <TextField {...props} variant="outlined" />,
                                    }}
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
                                title={actionLabel[1] as string}
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
                                title={actionLabel[2] as string}
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
                            isEditingServices={selectedAction === 2}
                            selectedWorkplaceId={selectedAmbulanceId}
                        />
                    </Grid>
                ) : (
                    [1, 2].includes(selectedAction) && (
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
                {isLoadingDoctorsServicesForSelectedAmbulance && (
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
