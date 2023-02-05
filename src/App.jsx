import { Provider } from 'react-redux'
import ReservationDialog from './components/Reservation/ReservationDialog/ReservationDialog'
import { store } from './store/store'
function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <ReservationDialog isOpen={true} onClose={() => console.log()} />
            </Provider>
        </div>
    )
}

export default App
