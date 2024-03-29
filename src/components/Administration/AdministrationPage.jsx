import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import cs from 'date-fns/locale/cs'
import { SnackbarProvider } from 'notistack'
import { Route, Routes } from 'react-router-dom'
import { withTheme } from '../../hoc'
import { NotMatch } from '../common'
import { AdministrationTopbar } from './AdministrationNavigation/components'
import {
    AdministrationWelcome,
    AdministrationCalendar,
    AdministrationServices,
    AdministrationNews,
    AdministrationOrders,
} from './Pages'

const AdministrationPage = () => {
    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={cs}
            localeText={{ okButtonLabel: 'Potvrdit', cancelButtonLabel: 'Zavřít' }}
        >
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <Routes>
                    <Route path="/" element={<AdministrationTopbar />}>
                        <Route path="/" element={<AdministrationWelcome />} />
                        <Route path="/orders" element={<AdministrationOrders />} />
                        <Route path="/services" element={<AdministrationServices />} />
                        <Route path="/calendar" element={<AdministrationCalendar />} />
                        <Route path="/announcements" element={<AdministrationNews />} />
                        <Route path="*" element={<NotMatch />} />
                    </Route>
                </Routes>
            </SnackbarProvider>
        </LocalizationProvider>
    )
}

export default withTheme(AdministrationPage)
