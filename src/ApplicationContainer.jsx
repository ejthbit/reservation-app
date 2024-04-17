import { CssBaseline } from '@mui/material'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { withTheme } from './hoc'
import { store } from './store/store'

const ApplicationContainer = () => {
    return (
        <>
            <CssBaseline />
            <Provider store={store}>
                <BrowserRouter basename={'/'}>
                    <App />
                </BrowserRouter>
            </Provider>
        </>
    )
}

export default withTheme(ApplicationContainer)
