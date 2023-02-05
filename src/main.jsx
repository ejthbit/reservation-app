import { CssBaseline } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store/store'
import { Provider } from 'react-redux'
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CssBaseline />
        <Provider store={store}>
            <BrowserRouter basename={'/'}>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)
