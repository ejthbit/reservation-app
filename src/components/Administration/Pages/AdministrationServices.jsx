import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Fade, Grid, styled, TextField, Typography } from '@mui/material'
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
import { AdministrationServicesTable } from './components'
// import ServicesTable from './ServicesTable'

const StyledButton = styled(Button)(({ theme }) => ({
    width: '30vw',
    height: '30vh',
    fontSize: '2rem',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        fontSize: '1.5rem',
    },
}))
const AdministrationServices = () => {
    const selectedAmbulanceId = useSelector(getUserConfigurationSelectedAmbulance)
    const [fetchDoctorServicesForSelectedMonth] = useLazyGetDoctorServicesForMonthQuery()

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
            <Box>
                {includes(selectedAction, [1, 2]) ? (
                    <Grid container gap={2}>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleClearActionsWorkflow}>
                                <ArrowBack />
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
                            <StyledButton
                                variant="contained"
                                color="primary"
                                onClick={() => handleSetActionWorkflow(1)}
                            >
                                Vytvořit nový rozpis
                            </StyledButton>
                        </Grid>
                        <Grid item>
                            <StyledButton
                                variant="outlined"
                                color="primary"
                                onClick={() => handleSetActionWorkflow(2)}
                            >
                                Upravit existující rozpis
                            </StyledButton>
                        </Grid>
                    </Box>
                )}
                {!isNilOrEmpty(dates) && (
                    <Grid item xs={12}>
                        <AdministrationServicesTable
                            data={dates}
                            selectedMonth={format(selectedMonth, 'yyyy-MM')}
                            isEditingServices={equals(selectedAction, 2)}
                            selectedWorkplaceId={selectedAmbulanceId}
                        />
                    </Grid>
                )}
            </Box>
        </Fade>
    )
}

export default AdministrationServices
