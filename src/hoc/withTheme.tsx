/* eslint-disable react/display-name */
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import { Suspense } from 'react'

const withTheme = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    return (props: any) => {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ThemeProvider
                    theme={createTheme({
                        ...{
                            components: {
                                MuiCssBaseline: {
                                    styleOverrides: {
                                        body: {
                                            backgroundColor: '#f9fafb',
                                        },
                                    },
                                },
                                MuiInputBase: {
                                    styleOverrides: {
                                        input: {
                                            '&:-webkit-autofill': {
                                                WebkitBoxShadow: '0 0 0 1000px white inset',
                                                WebkitTextFillColor: '#ffffff',
                                                WebkitBackgroundClip: 'text',
                                                transition: 'background-color 5000s ease-in-out 0s',
                                                boxShadow: 'inset 0 0 20px 20px #23232329',
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
