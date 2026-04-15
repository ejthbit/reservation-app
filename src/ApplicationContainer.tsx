import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR
const devTheme = createTheme({
    palette: {
        primary: { main: PRIMARY_COLOR },
        secondary: {
            main: '#0000009c',
        },
    },
    typography: {
        fontFamily: ['Poppins', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                contained: {
                    backgroundColor: PRIMARY_COLOR,
                    boxShadow: 'none',
                },
            },
        },
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
