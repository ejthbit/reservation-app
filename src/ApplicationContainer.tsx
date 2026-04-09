import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const devTheme = createTheme({
    palette: { primary: { main: '#6A11CB' } },
    typography: {
        fontFamily: ['Poppins', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    },
})

const ApplicationContainer = () => (
    <ThemeProvider theme={devTheme}>
        <CssBaseline />
        <BrowserRouter basename={'/'}>
            <App />
        </BrowserRouter>
    </ThemeProvider>
)

export default ApplicationContainer
