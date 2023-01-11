import { Button, Typography } from '@mui/material'

const ReservationButton = ({ className }) => {
    // const dispatch = useDispatch()

    // const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)

    // const handleToggleReservationModal = () => {
    //     setIsReservationModalOpen((prevState) => !prevState)
    //     if (isReservationModalOpen) dispatch(clearReservation())
    // }
    return (
        <Button
            className={className}
            size="large"
            color="primary"
            variant="contained"
            // onClick={handleToggleReservationModal}
        >
            <Typography>Objednat se</Typography>
        </Button>
    )
}

ReservationButton.propTypes = {}

export default ReservationButton
