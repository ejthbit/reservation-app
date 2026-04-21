import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import cs from 'date-fns/locale/cs'
import { SnackbarProvider } from 'notistack'
import { Route, Routes } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { AdministrationProvider } from '../../context/Administration/AdministrationProvider'
import { AutomaticLogOutDialog, NotMatch } from '../common'
import LandscapePrompt from './LandscapePrompt'
import { AdministrationTopbar } from './AdministrationNavigation/components'
import {
    AdministrationCalendar,
    AdministrationEmployees,
    AdministrationNews,
    AdministrationServices,
    AdministrationUsers,
    AdministrationVacation,
    AdministrationWelcome,
} from './Pages'
import checkTokenExpirationMiddleware from '../../middlewares/logOutAutomatically'

const AdministrationPage = () => (
    <SWRConfig
        value={{ revalidateOnFocus: false, errorRetryCount: 3, use: [checkTokenExpirationMiddleware] }}
    >
        <AdministrationProvider>
            <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={cs}
                localeText={{ okButtonLabel: 'Potvrdit', cancelButtonLabel: 'Zavřít' }}
            >
                <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                    <LandscapePrompt />
                    <AutomaticLogOutDialog />
                    <Routes>
                        <Route path="/" element={<AdministrationTopbar />}>
                            <Route path="/" element={<AdministrationWelcome />} />
                            <Route path="/services" element={<AdministrationServices />} />
                            <Route path="/calendar" element={<AdministrationCalendar />} />
                            <Route path="/announcements" element={<AdministrationNews />} />
                            <Route path="/employees" element={<AdministrationEmployees />} />
                            <Route path="/vacation" element={<AdministrationVacation />} />
                            <Route path="/users" element={<AdministrationUsers />} />
                            <Route path="*" element={<NotMatch />} />
                        </Route>
                    </Routes>
                </SnackbarProvider>
            </LocalizationProvider>
        </AdministrationProvider>
    </SWRConfig>
)

export default AdministrationPage
