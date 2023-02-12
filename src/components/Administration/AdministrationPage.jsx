import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import cs from 'date-fns/locale/cs'
import { SnackbarProvider } from 'notistack'
import { Route, Routes } from 'react-router-dom'
import { NotMatch } from '../common'
import AdministrationNavigation from './AdministrationNavigation/AdministrationNavigation'
import { AdministrationWelcome, AdministrationCalendar, AdministrationServices } from './Pages'

const AdministrationPage = () => {
    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={cs}
            localeText={{ okButtonLabel: 'Potvrdit', cancelButtonLabel: 'Zavřít' }}
        >
            <SnackbarProvider maxSnack={3}>
                <Routes>
                    <Route path="/" element={<AdministrationNavigation />}>
                        <Route path="/" element={<AdministrationWelcome />} />
                        <Route path="/services" element={<AdministrationServices />} />
                        <Route path="/calendar" element={<AdministrationCalendar />} />
                        <Route path="*" element={<NotMatch />} />
                    </Route>
                </Routes>
            </SnackbarProvider>
        </LocalizationProvider>
    )
}

export default AdministrationPage
