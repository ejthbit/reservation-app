import ReservationDialog from './components/ReservationDialog/ReservationDialog'
function App() {
    return (
        <div className="App">
            <ReservationDialog isOpen={true} onClose={() => console.log()} />
        </div>
    )
}

export default App
