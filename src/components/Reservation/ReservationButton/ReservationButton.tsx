import { Button, Typography } from '@mui/material'

const ReservationButton = () => {
    // const dispatch = useDispatch()

    // const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)

    // const handleToggleReservationModal = () => {
    //     setIsReservationModalOpen((prevState) => !prevState)
    //     if (isReservationModalOpen) dispatch(clearReservation())
    // }
    return (
        <Button
            size="large"
            color="primary"
            variant="contained"
            // onClick={handleToggleReservationModal}
        >
            <Typography>Objednat se</Typography>
        </Button>
    )
}

export default ReservationButton
