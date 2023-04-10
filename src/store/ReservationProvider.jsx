import { store } from './store'
import { Provider } from 'react-redux'
const ReservationProvider = ({ children }) => <Provider store={store}>{children}</Provider>

export default ReservationProvider
