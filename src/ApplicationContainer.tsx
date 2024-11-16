import { CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { withTheme } from './hoc'

const ApplicationContainer = () => (
    <>
        <CssBaseline />
        <BrowserRouter basename={'/'}>
            <App />
        </BrowserRouter>
    </>
)

export default withTheme(ApplicationContainer)
