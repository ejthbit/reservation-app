import React from 'react'
import ReactDOM from 'react-dom/client'
import ApplicationContainer from './ApplicationContainer'

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('Root element not found. Please ensure the element with id "root" exists in your HTML.')
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ApplicationContainer />
    </React.StrictMode>,
)
