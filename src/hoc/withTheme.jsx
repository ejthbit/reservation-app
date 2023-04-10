/* eslint-disable react/display-name */
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import { Suspense } from 'react'
// import theme from 'app/theme'
// const theme = await import(import.meta.env.VITE_WEBUI_MODULE) // This is properly ignored in dev environment
const theme = import.meta.env.PROD && (await import(import.meta.env.VITE_WEBUI_MODULE))
const withTheme = (WrappedComponent) => {
    return (props) => {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ThemeProvider
                    theme={createTheme({
                        ...theme.themeOptions,
                        ...{
                            components: {
                                MuiInputBase: {
                                    styleOverrides: {
                                        input: {
                                            '&:-webkit-autofill': {
                                                WebkitBoxShadow: '0 0 0 1000px white inset',
                                                WebkitTextFillColor: '#000',
                                            },
                                        },
                                    },
                                },
                            },
                            typography: {
                                fontFamily: ['Poppins', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
                            },
                        },
                    })}
                >
                    <WrappedComponent {...props} />
                </ThemeProvider>
            </Suspense>
        )
    }
}

export default withTheme
