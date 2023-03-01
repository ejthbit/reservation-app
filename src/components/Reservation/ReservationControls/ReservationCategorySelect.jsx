import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import useReservationButton from '../../../hooks/useReservationButton'
import {
    getPreferredDoctor,
    getSelectedCategory,
    useGetBookingCategoriesQuery,
} from '../../../store/reservationProcess'
import { setSelectedCategory } from '../../../store/reservationProcess/reservationProcessSlice'
import { Dropdown } from '../../common'

const ReservationCategorySelect = ({ step, isRequired = false }) => {
    const dispatch = useDispatch()
    const selectedDoctorId = useSelector(getPreferredDoctor)
    const { data: categories, isFetching } = useGetBookingCategoriesQuery({ selectedDoctorId })
    const selectedCategory = useSelector(getSelectedCategory)
    useReservationButton({ dependency: [selectedCategory], step, isRequired })

    return (
        <Dropdown
            label="Typ vyšetření"
            value={selectedCategory}
            isLoading={isFetching}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
            options={categories}
        />
    )
}

ReservationCategorySelect.propTypes = {
    isRequired: PropTypes.bool,
    step: PropTypes.string,
}
export default ReservationCategorySelect
