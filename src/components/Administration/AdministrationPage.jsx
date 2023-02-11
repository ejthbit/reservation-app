import { Route, Routes } from 'react-router-dom'
import { NotMatch } from '../common'
import AdministrationNavigation from './AdministrationNavigation/AdministrationNavigation'
import { AdministrationWelcome, AdministrationCalendar } from './Pages'

const AdministrationPage = () => {
    return (
        <Routes>
            <Route path="/" element={<AdministrationNavigation />}>
                <Route path="/" element={<AdministrationWelcome />} />
                <Route path="/orders" element={<>Orders</>} />
                <Route path="/calendar" element={<AdministrationCalendar />} />
                <Route path="*" element={<NotMatch />} />
            </Route>
        </Routes>
    )
}

export default AdministrationPage
